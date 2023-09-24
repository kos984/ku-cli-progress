import { Bar, BarItem, presets, Progress } from '../';
import * as chalk from 'chalk';
import { TextBarItem } from './text-bar-item';

const bar = new Bar();
const progress = new Progress({ total: 100 });

const redProgress = new Progress({ total: 100, start: 30 });
const blueProgress = new Progress({ total: 100 });

const template = `[{bar}] {percentage} ETA: {eta} speed: {speed} duration: {duration} {value}/{total}`;

const keyLength = Object.keys(presets).reduce(
  (length, key) => (key.length > length ? key.length : length),
  0,
);
Object.keys(presets).forEach(key => {
  bar.add(
    new BarItem(progress, {
      template: ' ' + key.padEnd(keyLength, ' ') + ': ' + template,
      options: presets[key],
    }),
  );
});

bar.add(new TextBarItem(''));

Object.keys(presets).forEach(key => {
  bar.add(
    new BarItem([redProgress, blueProgress], {
      options: presets[key],
      template: ` ${key.padEnd(
        keyLength,
        ' ',
      )}: [{bars}] {percentage}/{percentage} ETA: {eta}/{eta} speed: {speed}/{speed} duration: {duration}/{duration} {value}/{total}/{value}/{total}`,
      formatters: {
        bar: (str, progress, progresses) => {
          const colors = [chalk.yellowBright, chalk.blueBright];
          const index = progresses.findIndex(p => p === progress);
          return (colors[index] || chalk.yellow)(str);
        },
      },
    }),
  );
});

bar.start();

const progresses = [progress, redProgress, blueProgress];

progresses.forEach(progress => {
  const interval = setInterval(() => {
    progress.increment();
    if (progress.getProgress() >= 1) {
      clearInterval(interval);
    }
  }, 100);
});
