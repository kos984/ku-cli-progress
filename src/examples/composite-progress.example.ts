import { Bar, BarItem, presets, Progress } from '../';
import * as chalk from 'chalk';

const bar = new Bar().start();
const progresses = [
  new Progress({ total: 1000, start: 300 }),
  new Progress({ total: 1000 }),
];
bar.add(
  new BarItem(progresses, {
    options: presets.shades,
    formatters: {
      bar: (str, progress, progresses) => {
        const index = progresses.findIndex(p => p === progress);
        const colors = [chalk.green, chalk.yellowBright];
        return colors[index](str);
      },
    },
  }),
);

progresses.forEach(progress => {
  const next = () => {
    setTimeout(
      () => {
        progress.increment();
        if (progress.getProgress() >= 1) {
          return;
        }
        next();
      },
      Math.round(Math.random() * 10),
    );
  };
  next();
});
