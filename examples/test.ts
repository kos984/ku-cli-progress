import { Render } from '../src/render';
import { Progress } from '../src/progress';
import { Bar } from '../src/bar';
// @ts-ignore
import chalk from 'chalk';

let progresses: (Progress | Progress[])[] = [];

const formatBarWithTextInCenter = (barString: string, progress: Progress, text: string): string => {
  const done = Math.round(progress.getProgress() * barString.length);
  const start = barString.substr(0, barString.length / 2 - text.length / 2 - 1);
  const end = barString.substr(barString.length / 2 + text.length / 2 + 1);
  const out = `${start} ${text} ${end}`;
  return chalk.yellowBright(out.substr(0, done)) + out.substr(done);
};

progresses = [
  new Progress({
    total: 1030,
    render: new Render({
      bar: {
        glue: '',
        completeChar: '∎',
        resumeChar: ' ',
      },
      format: {
        bar: (str, [progress]) => {
          const percentage = (Math.round(progress.getProgress() * 10000) / 100).toFixed(2) + '%';
          return formatBarWithTextInCenter(str, progress, percentage + ' ETA: ' + progress.getDataValue('eta'));
        },
      }
    }),
  }),
  new Progress({
    total: 1000,
    render: new Render({
      bar: {
        glue: '',
        completeChar: '∎',
        resumeChar: ' ',
      },
      format: {
        bar: (str, [progress]) => formatBarWithTextInCenter(str, progress, progress.getDataValue('percentage')),
      }
    }),
  }),
  new Progress({
    total: 2000,
    render: new Render({
      bar: {
        glue: '|',
        completeChar: '█',
        resumeChar: '░',
      },
      format: {
        bar: str => str.split('|').reduce((complete, left) => chalk.green(complete) + chalk.redBright(left)),
      }
    }),
  }),
  [
    new Progress({ start: 20, total: 1000, tag: 'red', render: new Render({
        template: `[{bars}] {test} {eta} {red_value}/{red_total} | {blue_value}/{blue_total}`,
        format: {
          value: str => chalk.red(str),
          total: str => chalk.red(str),
          bar: str => chalk.red(str),
          bars: str => chalk.green(str),
        }
      })}),
    new Progress({ start: 50, total: 1000, tag: 'blue', render: new Render({
        format: {
          value: str => Number(str) > 100 ? chalk.green(str) : chalk.blue(str),
          total: str => chalk.blue(str),
          bar: str => chalk.blue(str),
        }
      })})
  ],
  new Progress({total: 5000, render: new Render({
      bar: {
        resumeChar: '▢',
        completeChar: '▣',
      }
    })}),
];

/*
for(let i = 0; i < 20; i++) {
  progresses.push(
    new Progress({total: 1000, render: new Render({
        bar: {
          resumeChar: ' ',
          completeChar: '▣',
        },
        format: {
          value: (str, [progress]) => (progress.getTotal() - Number(str)).toString()
        }
      })}),
  )
}
 */

// Just for fan ))
// progresses.push((progresses[2] as Progress[])[1] as Progress);

const bar = new Bar(progresses);
bar.start();

setInterval(() => {
  // @ts-ignore
  progresses.forEach((p) => {
    if (Array.isArray(p)) {
      p.forEach(i => {
        if (i.getProgress() < 1) {
          i.increment(Math.round(Math.random() * 10), { test: '[some addition data]' })
        }
      });
    } else {
      if (p.getProgress() < 1) {
        // p.increment(Math.round(Math.random() * 10));
        p.increment(10);
      }
    }
  })

}, 100);
