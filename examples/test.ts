import { ProgressRender } from '../src/render';
import { Progress } from '../src/progress';
import { Render } from '../src/bar';
// @ts-ignore
import chalk from 'chalk';

let progresses: (Progress | Progress[])[] = [];

progresses = [
  new Progress({
    total: 1000,
    render: new ProgressRender({
      bar: {
        glue: '',
        completeChar: '∎',
        resumeChar: ' ',
      },
      format: {
        bar: (str, [progress]) => {
          const done = (str.match(/∎+/) ?? [''])[0].length
          const percentage = progress.getDataValue('percentage');
          const start = str.substr(0, str.length / 2 - percentage.length / 2 - 1);
          const end = str.substr(str.length / 2 + percentage.length / 2 + 1
          );
          const out = `${start} ${percentage} ${end}`;
          return chalk.yellowBright(out.substr(0, done)) + out.substr(done);
        },
      }
    }),
  }),
  new Progress({
    total: 1000,
    render: new ProgressRender({
      bar: {
        glue: '',
        completeChar: '∎',
        resumeChar: ' ',
      },
      format: {
        bar: (str, [progress]) => {
          const percentage = progress.getDataValue('percentage');
          const start = str.substr(0, str.length / 2 - percentage.length / 2 - 1);
          const end = str.substr(str.length / 2 + percentage.length / 2 + 1
          );
          return chalk.redBright(`${start} ${percentage} ${end}`);
        },
      }
    }),
  }),
  new Progress({
    total: 2000,
    render: new ProgressRender({
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
    new Progress({ start: 20, total: 1000, tag: 'red', render: new ProgressRender({
        template: `[{bars}] {test} {eta} {red_value}/{red_total} | {blue_value}/{blue_total}`,
        format: {
          value: str => chalk.red(str),
          total: str => chalk.red(str),
          bar: str => chalk.red(str),
          bars: str => chalk.green(str),
        }
      })}),
    new Progress({ start: 50, total: 1000, tag: 'blue', render: new ProgressRender({
        format: {
          value: str => Number(str) > 100 ? chalk.green(str) : chalk.blue(str),
          total: str => chalk.blue(str),
          bar: str => chalk.blue(str),
        }
      })})
  ],
  new Progress({total: 5000, render: new ProgressRender({
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

const bar = new Render(progresses);
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
