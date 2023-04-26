import { ProgressRender } from '../src/render';
import { Progress } from '../src/progress';
import { Render } from '../src/bar';
// @ts-ignore
import chalk from 'chalk';

let progresses: Progress[] = [];

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
];

const bar = new Render(progresses);
bar.start();

setInterval(() => {
  // @ts-ignore
  progresses.forEach((p) => {
    if (p.getProgress() < 1) {
      // p.increment(Math.round(Math.random() * 10));
      p.increment(10);
    }
  })

}, 300);
