import { Render } from '../render';
import { Progress } from '../progress';
import { Bar } from '../bar';
// @ts-ignore
import chalk from 'chalk';

let progresses: Progress[] = [];

progresses = [
  new Progress({
    total: 1000,
    render: new Render({
      bar: {
        glue: '',
        completeChar: '∎',
        resumeChar: ' ',
      },
      format: {
        bar: (str, [progress]) => {
          const done = Math.round(progress.getProgress() * str.length);
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

const bar = new Bar(progresses);
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
