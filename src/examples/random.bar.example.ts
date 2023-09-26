/* eslint-disable max-classes-per-file */
import { Bar, Progress, BarItem, presets, IProgress } from '../';
import * as chalk from 'chalk';
import { TextBarItem } from './text-bar-item';

const progresses: IProgress[] = [];
const bar = new Bar();

{
  // default bar
  bar.add(new TextBarItem('Default bar:'));
  const progress = new Progress({ total: 100 });
  bar.add(new BarItem(progresses));
  progresses.push(progress);
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
        template:
          '[{bars}] {percentage} ETA: {eta} speed: {speed} duration: {duration} {red_value} {value}/{total}',
        formatters: {
          red_bar: str => chalk.red(str),
          bar: str => chalk.green(str),
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
        template:
          '[{bars}] {percentage} ETA: {eta} speed: {speed} duration: {duration} {value}/{total}',
        options: presets.shades,
        formatters: {
          bar: (str, progress, progresses) => {
            const index = progresses.findIndex(p => p === progress);
            const colors = [chalk.green, chalk.red, chalk.blue, chalk.yellow];
            return colors[index](str);
          },
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
      template: '[{bar}] {percentage} user: {user}',
      formatters: {
        // format custom payload
        user: str => chalk.bold(str),
      },
    }),
  );
}

{
  // use presets
  bar.add(new TextBarItem('Presets:'));
  const rectProgress = new Progress({ total: 100, start: 33 });
  progresses.push(rectProgress);
  bar.add(
    new BarItem(rectProgress, {
      options: presets.rect,
    }),
  );

  const shadesProgress = new Progress({ total: 100, start: 77 });
  progresses.push(shadesProgress);

  bar.add(
    new BarItem(shadesProgress, {
      options: presets.shades,
    }),
  );
}

{
  // Percentage in bar center (just for fan)
  bar.add(new TextBarItem('Percentage in bar center (just for fan):'));
  const textInBarProgress = new Progress({ total: 100, start: 0 });
  progresses.push(textInBarProgress);
  bar.add(
    new BarItem([textInBarProgress], {
      options: presets.rect,
      formatters: {
        bar: (str, progress) => {
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
      template:
        '[{bar}] {percentage} ETA: {eta} speed: {speed} duration: {duration} {value}/{total}',
      options: presets.rect,
      formatters: {
        bar: str => chalk.yellowBright(str),
        percentage: (str, progress) =>
          spin.next(progress.getProgress() < 1).value + ' ' + str,
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
      tagDelimiter: ':',
      template:
        chalk.yellowBright(
          ' '.repeat(20) +
            '{0:percentage} {0:spin} ETA: {0:eta} speed: {0:speed} duration: {0:duration} {0:value}/{0:total}\n',
        ) +
        '[{0:bar}][{0:spin}] {0:percentage} ETA: {0:eta} speed: {speed} duration: {0:duration} {0:value}/{0:total}',
      options: {
        glue: '>>>>',
        width: 36,
        resumeChar: ' ',
        completeChar: ' ',
      },
      formatters: {
        '0:bar': str => chalk.yellowBright(str),
      },
      dataProviders: {
        spin: progress => spin.next(progress.getProgress() < 1).value,
        longText: () =>
          'this is a long text with multi lines\nline 2 with some text',
      },
    }),
  );
}

{
  bar.add(new TextBarItem('Custom progress >>>'));
  const textInBarProgress = new Progress({ total: 100, start: 0 });
  progresses.push(textInBarProgress);

  bar.add(
    new BarItem([textInBarProgress], {
      template:
        '[{bar}] {percentage} ETA: {eta} speed: {speed} duration: {duration} {value}/{total}',
      options: {
        glue: '|',
        width: 40,
        resumeChar: ' ',
        completeChar: ' ',
      },
      formatters: {
        bar: (str, progress) => {
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
    new BarItem([textInBarProgress], {
      template:
        '[{bar}] {percentage} ETA: {eta} speed: {speed} duration: {duration} {value}/{total}',
      options: {
        glue: '|',
        width: 40,
        resumeChar: ' ',
        completeChar: ' ',
      },
      formatters: {
        bar: (str, progress) => {
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
  class CustomBarItem extends BarItem {
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
    new BarItem([textInBarProgress], {
      template:
        '[{bar}] {percentage} ETA: {eta} speed: {speed} duration: {duration} {value}/{total}',
      options: { ...presets.shades, glue: '|' },
      formatters: {
        bar: str => {
          const [start, end] = str.split('|');
          return chalk.blueBright(start) + chalk.redBright(end);
        },
      },
    }),
  );
}

{
  const progress = new Progress({ total: 100 });
  bar.add(
    new BarItem(progress, {
      options: {
        ...presets.braille,
        glue: '|',
      },
      formatters: {
        bar: str => {
          const [done, left] = str.split('|');
          return chalk.yellowBright(done) + chalk.yellow(left);
        },
      },
    }),
  );
  progresses.push(progress);
}

bar.start();

const interval = setInterval(() => {
  let update = false;
  progresses.forEach(process => {
    if (process.getProgress() < 1) {
      process.increment(1);
      update = true;
    }
  });
  if (update === false) {
    clearInterval(interval);
  }
}, 300);
