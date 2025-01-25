#!/usr/bin/env tsx

import {
  Bar,
  Progress,
  presets,
  IProgress,
  BarDataResult,
  BarDataProvider,
} from '../../../index';
import * as chalk from 'chalk';
import { TextBarItem } from '../../legacy/text-bar-item';
import { loopProgresses } from '../../helpers/loop-progresses';
import { BarsFormatter } from '../../../lib/formatters/bars-formatter';
import { BarItem } from '../../../lib/bar-items/bar-item/bar-item';
import { stringTemplate } from '../../../lib/templates/string.template';

const progresses: IProgress[] = [];
const bar = new Bar();

{
  // Percentage in bar center (just for fan):
  // [■■■■■■■■         20.00%                 ] 20% ETA: 8s speed: 10/s duration: 2s 20/100
  bar.add(new TextBarItem('Percentage in bar center (just for fan):'));
  const textInBarProgress = new Progress({ total: 100, start: 0 });
  progresses.push(textInBarProgress);
  bar.add(
    new BarItem([textInBarProgress], {
      options: {
        ...presets.rect,
        formatter: {
          formatter: (value, progress) => {
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
            return new BarDataResult([
              {
                str:
                  chalk.yellowBright(out.substring(0, done)) +
                  out.substring(done),
                progress,
              },
            ]);
          },
        },
      },
    }),
  );

  // debug ....
  bar.add(
    new BarItem([textInBarProgress], {
      options: {
        // width: 40, // 58.00% 17 half
        ...presets.rect,
        formatter: {
          formatter: (value, progress) => {
            const str = value.toString();

            const percent =
              ' ' + (progress.getProgress() * 100).toFixed(2) + '% '; // 8
            const newStr = str.substring(0, 16) + percent + str.substring(24);
            return new BarDataResult([
              {
                str: chalk.yellowBright(
                  newStr.substring(0, value.getParts()[0].str.length),
                ),
                progress,
              },
              {
                str: newStr.substring(value.getParts()[0].str.length),
                progress: null,
              },
            ]);
          },
        },
      },
    }),
  );
}

{
  // Custom progress >>>
  // [      39.00% >>>                        ] 39 ETA: 6 speed: 10 duration: 4 39/100

  bar.add(new TextBarItem('Custom progress >>> AA'));
  const textInBarProgress = new Progress({ total: 100, start: 0 });
  progresses.push(textInBarProgress);

  bar.add(
    new BarItem([textInBarProgress], {
      template: stringTemplate(
        '[{bar}] {percentage} ETA: {eta} speed: {speed} duration: {duration} {value}/{total}',
      ),
      options: {
        width: 40,
        resumeChar: ' ',
        completeChar: ' ',
        formatter: {
          formatter: (value, progress) => {
            const percent = (progress.getProgress() * 100).toFixed(2);
            const text = `${percent}% >>>`;
            const [start] = value.getParts().map(part => part.str);
            const parts = value.getParts();
            parts[0].str = chalk.yellowBright(
              `${start}${text}`.substring(text.length),
            );
            return value;
          },
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
      template: stringTemplate(
        '[{bar}] {percentage} ETA: {eta} speed: {speed} duration: {duration} {value}/{total}',
      ),
      options: {
        width: 40,
        resumeChar: ' ',
        completeChar: ' ',
        formatter: {
          formatter: (value, progress) => {
            const percent = (progress.getProgress() * 100).toFixed(2);
            const text = `<<< ${percent}%`;
            const [start, end] = value.getParts().map(part => part.str);
            const parts = value.getParts();
            parts[0].str = end;
            parts[1].str = chalk.yellowBright(
              (text + start).substring(0, start.length),
            );
            return value;
          },
        },
      },
    }),
  );
}

{
  bar.add(new TextBarItem('Custom bar item:'));
  class CustomBarDataProvider extends BarDataProvider {
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
    new BarItem<{ dataProviders: { fanBar: string } }>(progress, {
      options: { completeChar: ' ', resumeChar: '·' },
      template: ({
        fanBar,
        percentage,
        speed,
        duration,
        value,
        total,
        etaHumanReadable,
      }) =>
        `[${fanBar}] ${percentage}% ETA: ${etaHumanReadable} speed: ${speed} duration: ${duration} ${value}/${total}`,
      dataProviders: {
        fanBar: new CustomBarDataProvider({
          completeChar: ' ',
          resumeChar: '·',
        }),
      },
    }),
  );
}

{
  const progress = new Progress({ total: 100 });
  progresses.push(progress);
  bar.add(new TextBarItem('Fun ))'));
  bar.add(
    new BarItem(progress, {
      template: ({ bar }) => `[${bar}  ]`,
      options: {
        width: 18,
        glue: '😋',
        completeChar: '💩',
        resumeChar: '🍒',
      },
    }),
  );
}

{
  // FIXME: add to README.md
  bar.add(new TextBarItem('Change left color:'));
  const textInBarProgress = new Progress({ total: 100, start: 0 });
  progresses.push(textInBarProgress);
  bar.add(
    new BarItem([textInBarProgress], {
      template: stringTemplate(
        '[{bar}] {percentage} ETA: {eta} speed: {speed} duration: {duration} {value}/{total}',
      ),
      options: {
        ...presets.shades,
        formatter: new BarsFormatter([chalk.greenBright, chalk.redBright]),
      },
    }),
  );
}
bar.start();

loopProgresses(progresses);
