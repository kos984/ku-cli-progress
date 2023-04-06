import { Render } from '../render';
import { TerminalTty } from '../terminal-tty';
import { Progress } from '../progress';
import { Bar } from '../bar';
// @ts-ignore
import chalk from 'chalk';

const t = new TerminalTty()
// const r = new Render(t);

const progress = new Progress({
  total: 1000,
});

const r = new Render();
const s = r.render([progress]);

console.log(s);


const progresses = [
  new Progress({ total: 2000 }),
  [
    new Progress({ start: 20, total: 1000, tag: 'red', render: new Render({
        template: `[{bars}] {test} {eta} {red_value}/{red_total} | {blue_value}/{blue_total}`,
        bar: { color: chalk.red },
        format: {
          // value: process => chalk.red(process.getValue()),
          // total: process => chalk.red(process.getTotal()),
          value: str => chalk.red(str),
          total: str => chalk.red(str),
        }
      })}),
    new Progress({ start: 50, total: 1000, tag: 'blue', render: new Render({
        bar: { color: chalk.blue },
        format: {
          // value: process => chalk.blue(process.getValue()),
          // total: process => chalk.blue(process.getTotal()),
          value: str => Number(str) > 100 ? chalk.green(str) : chalk.blue(str),
          total: str => chalk.blue(str),
        }
      })})
  ],
  new Progress({total: 5000}),
];

const bar = new Bar(progresses);
bar.start();

setInterval(() => {
  progresses.forEach(p => {
    if (Array.isArray(p)) {
      p.forEach(i => i.increment(Math.round(Math.random() * 10)));
    } else {
      p.increment(Math.round(Math.random() * 10));
    }
  })

}, 100);

/*
setInterval(() => {
  r.write(`[${r.render([progress])}] ${Math.round(progress.getProgress() * 100)}%`)
  progress.increment();
}, 500);

setInterval(() => {
  t.clear();
  console.log(JSON.stringify(
    {
      "success": true,
      "data": {
        "goRewards": true,
      }
    }
  ));
  t.refresh();
}, 3000);
*/
