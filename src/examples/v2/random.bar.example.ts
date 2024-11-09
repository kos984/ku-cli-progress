/* eslint-disable max-classes-per-file */
import { Bar, Progress, presets, IProgress } from '../../';
import * as chalk from 'chalk';
import { TextBarItem } from '../text-bar-item';
import { loopProgresses } from '../helpers';
import { BarsFormatter } from '../../lib/formatters/bars-formatter';
import { BarItem } from '../../lib/bar-item';
import * as process from 'node:process';

const progresses: IProgress[] = [];
const bar = new Bar();

{
  // default bar
  bar.add(new TextBarItem('Default bar:'));
  const progress = new Progress({ total: 100 });
  progresses.push(progress);
  bar.add(new BarItem(progresses));
}

{
  // composite progress bar
  bar.add(new TextBarItem('Composite progress bar:'));
  const progress = new Progress({ total: 100 });
  progresses.push(progress);
  bar.add(
    new BarItem(
      [progress, new Progress({ total: 100, start: 50, tag: 'red' })],
      {
        // override default template
        template: (
          { bars, percentage, eta, speed, duration, value, total },
          red,
        ) => {
          return `[${bars}] ${percentage}% ETA: ${eta}s speed: ${speed}/s duration: ${duration}s ${red.value} ${value}/${total}`;
        },
        formatters: {
          bars: new BarsFormatter([null, chalk.red]),
        },
      },
    ),
  );
}

{
  // multi colors composite progress bar
  bar.add(new TextBarItem('Multi colors composite progress bar:'));
  const greenProgress = new Progress({ total: 100, start: 50, tag: 'green' });
  progresses.push(greenProgress);
  bar.add(
    new BarItem(
      [
        greenProgress,
        new Progress({ total: 100, start: 65, tag: 'red' }),
        new Progress({ total: 100, start: 78, tag: 'blue' }),
        new Progress({ total: 100, start: 90, tag: 'yellow' }),
      ],
      {
        template: ({
          bars,
          percentage,
          eta,
          speed,
          duration,
          value,
          total,
        }) => {
          return `[${bars}] ${percentage}% ETA: ${eta}s speed: ${speed}/s duration: ${duration}s ${value}/${total}`;
        },
        options: presets.shades,
        formatters: {
          bars: (str, progress, progresses) => {
            const index = progresses.findIndex(p => p === progress);
            const colors = [chalk.green, chalk.red, chalk.blue, chalk.yellow];
            return colors[index](str);
          },
          // OR bars: new BarsFormatter([chalk.green, chalk.red, chalk.blue, chalk.yellow]),
        },
      },
    ),
  );
}

{
  // custom payload
  bar.add(new TextBarItem('Custom payload:'));
  const progressWithCustomPayload = new Progress(
    { total: 100, start: 75 },
    {
      user: 'John Doe',
    },
  );
  progresses.push(progressWithCustomPayload);
  bar.add(
    new BarItem([progressWithCustomPayload], {
      template: ({ bar, percentage, progress }) => {
        const payload = progress.getPayload() as { user: string };
        const user = chalk.bold(payload.user);
        return `[${bar}] ${percentage}% user: ${user}`;
      },
    }),
  );
}

{
  // use presets
  bar.add(new TextBarItem('Presets:'));
  Object.keys(presets).forEach(presetKey => {
    const presetProgress = new Progress({ total: 100, start: 33 }, { name: presetKey });
    progresses.push(presetProgress);
    bar.add(
      new BarItem(presetProgress, {
        template: ({
          bar,
          percentage,
          eta,
          speed,
          duration,
          value,
          total,
          progress,
        }) => {
          const payload = progress.getPayload() as { name: string };
          return `[${bar}] ${percentage}% ETA: ${eta} speed: ${speed} duration: ${duration} ${value}/${total} [${payload.name}]`;
        },
        options: presets[presetKey],
      }),
    );
  });
}

{
  // Percentage in bar center (just for fan)
  bar.add(new TextBarItem('Percentage in bar center (just for fan):'));
  const textInBarProgress = new Progress({ total: 100, start: 0 });
  progresses.push(textInBarProgress);
  bar.add(
    new BarItem([textInBarProgress], {
      options: presets.rect,
        /*
      template: ({ bar, percentage }) => {
        const percentageString = ` ${percentage} % `;
        const buff = bar.toString().split('');
        const startPosition = Math.round(
          buff.length / 2 - percentageString.length / 2,
        );
        for (const [index, char] of percentageString.split('').entries()) {
          buff[startPosition + index] = char;
        }
        const done = Math.round(textInBarProgress.getProgress() * buff.length);
        const newBar =
          chalk.yellowBright(buff.slice(0, done).join('')) +
          buff.slice(done).join('');
        return `[${bar}] ${percentage}% `;
      },
         */
      formatters: {
        bar: (value, progress) => {
          const str = value.toString();
          const percentage =
            ' ' +
            (Math.round(progress.getProgress() * 10000) / 100).toFixed(2) +
            '% ';
          const done = Math.round(progress.getProgress() * str.length);
          const startPosition = Math.round(
            str.length / 2 - percentage.length / 2,
          );
          const out =
            str.substring(0, startPosition) +
            percentage +
            str.substring(startPosition + percentage.length);
          return (
            chalk.yellowBright(out.substring(0, done)) + out.substring(done)
          );
        },
      },
    }),
  );
}

function* rotate(
  values: string[],
  minTimeoutMs: number,
): Generator<string, string, boolean> {
  let last = 0;
  let index = 0;
  let next: boolean = true;
  while (true) {
    const now = Date.now();
    if (next && now - last > minTimeoutMs) {
      index = ++index % values.length;
      last = now;
    }
    next = yield values[index];
  }
}

{
  // Custom percentage formatter
  bar.add(new TextBarItem('Custom percentage formatter:'));
  const spin = rotate(['\\', '|', '/', '-'], 150);
  const textInBarRotation = new Progress({ total: 100, start: 0 });
  progresses.push(textInBarRotation);

  bar.add(
    new BarItem([textInBarRotation], {
      template: ({
        bar,
        percentage,
        eta,
        speed,
        duration,
        value,
        total,
        progress,
      }) => {
        const spinText = spin.next(progress.getProgress() < 1).value;
        return `[${bar}] ${spinText} ${percentage}% ETA: ${eta}s speed: ${speed}/s duration: ${duration}s ${value}/${total}`;
      },
      options: presets.rect,
      formatters: {
        bar: str => chalk.yellowBright(str),
      },
    }),
  );
}

{
  bar.add(new TextBarItem('Multi like template:'));
  const spin = rotate(['\\', '|', '/', '-'], 150);
  const textInBarProgress = new Progress({ total: 100, start: 0, tag: '0' });
  progresses.push(textInBarProgress);
  bar.add(
    new BarItem([textInBarProgress], {
      template: ({
        bar,
        percentage,
        eta,
        speed,
        duration,
        value,
        total,
        progress,
      }) => {
        const spinText = spin.next(progress.getProgress() < 1).value;
        return (
          '='.repeat(20) + '\n' +
          chalk.yellowBright(
            ' '.repeat(20) +
              `${percentage} ${spinText} ETA: ${eta}s speed: ${speed}/s duration: ${duration}s ${value}/${total}\n`,
          ) +
          `[${bar}][${spinText}] ${percentage} ETA: ${eta} speed: ${speed} duration: ${duration} ${value}/${total}\n` +
          '='.repeat(20)
        );
      },
      options: {
        glue: '>>>>',
        width: 36,
        resumeChar: ' ',
        completeChar: ' ',
      },
      formatters: {
        bar: str => chalk.yellowBright(str),
      },
      // TODO: think again about dataProviders
      dataProviders: {
        spin: progress => spin.next(progress.getProgress() < 1).value,
      },
    }),
  );
}

/*

{
  bar.add(new TextBarItem('Custom progress >>>'));
  const textInBarProgress = new Progress({ total: 100, start: 0 });
  progresses.push(textInBarProgress);

  bar.add(
    new BarItemLegacy([textInBarProgress], {
      template:
        '[{bar}] {percentage} ETA: {eta} speed: {speed} duration: {duration} {value}/{total}',
      options: {
        glue: '|',
        width: 40,
        resumeChar: ' ',
        completeChar: ' ',
      },
      formatters: {
        bar: (value, progress) => {
          const str = value.toString();
          const percent = (progress.getProgress() * 100).toFixed(2) + '% >>>';
          const [start, end] = str.split('|');
          const text =
            percent.length < start.length
              ? start.substring(0, start.length - percent.length) + percent
              : percent.substring(percent.length - start.length);
          return chalk.yellowBright(text + end);
        },
      },
    }),
  );
}

{
  bar.add(new TextBarItem('reversed progress <<<'));
  const textInBarProgress = new Progress({ total: 100, start: 0 });
  progresses.push(textInBarProgress);
  bar.add(
    new BarItemLegacy([textInBarProgress], {
      template:
        '[{bar}] {percentage} ETA: {eta} speed: {speed} duration: {duration} {value}/{total}',
      options: {
        glue: '|',
        width: 40,
        resumeChar: ' ',
        completeChar: ' ',
      },
      formatters: {
        bar: (value, progress) => {
          const str = value.toString();
          const percent =
            '<<< ' + (progress.getProgress() * 100).toFixed(2) + '%';
          const [end, start] = str.split('|');
          const text =
            end.length > percent.length
              ? percent + end.substring(0, end.length - percent.length)
              : percent.substring(0, end.length);
          return chalk.greenBright(start + text);
        },
      },
    }),
  );
}

{
  bar.add(new TextBarItem('Custom bar item:'));
  class CustomBarItem extends BarItemLegacy {
    protected getBarParts(params): { left: string; done: string } {
      const { size } = params;
      const customDoneStr = progress.getProgress() < 1 ? 'ᗧ' : 'ᗣ';
      // '🍒'.length = 2
      const half = this.options.resumeChar.repeat(this.options.width / 2 - 1);
      const food =
        size <= half.length ? '🍒' : this.options.resumeChar.repeat(2);
      return {
        done: (
          this.options.completeChar.repeat(size) + customDoneStr
        ).substring(customDoneStr.length),
        left: (half + food + half).substring(size), // 'ᗧ·····🍒······ᗣ'
      };
    }
  }
  const progress = new Progress({ total: 100 });
  progresses.push(progress);
  bar.add(
    new CustomBarItem(progress, {
      options: { completeChar: ' ', resumeChar: '·' },
    }),
  );
}

{
  bar.add(new TextBarItem('Change left color:'));
  const textInBarProgress = new Progress({ total: 100, start: 0 });
  progresses.push(textInBarProgress);
  bar.add(
    new BarItemLegacy([textInBarProgress], {
      template:
        '[{bar}] {percentage} ETA: {eta} speed: {speed} duration: {duration} {value}/{total}',
      options: { ...presets.shades, glue: '|' },
      formatters: {
        bar: str => {
          const [start, end] = str.toString().split('|');
          return chalk.blueBright(start) + chalk.redBright(end);
        },
      },
    }),
  );
}

{
  const progress = new Progress({ total: 100 });
  bar.add(
    new BarItemLegacy(progress, {
      options: {
        ...presets.braille,
      },
      formatters: {
        bar: new BarsFormatter([chalk.yellowBright, chalk.yellow]),
      },
    }),
  );
  progresses.push(progress);
}


 */
bar.start();

loopProgresses(progresses, () => 300);
