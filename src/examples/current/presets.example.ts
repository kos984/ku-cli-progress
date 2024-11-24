import { Bar, BarItem, BarsFormatter, presets, Progress } from '../../';
import * as chalk from 'chalk';
import { TextBarItem } from '../legacy/text-bar-item';
import { loopProgresses } from '../helpers/loop-progresses';
import { stringTemplate } from '../../lib/templates/string.template';

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
      template: stringTemplate(
        ' ' + key.padEnd(keyLength, ' ') + ': ' + template,
      ),
      options: presets[key],
    }),
  );
});

bar.add(new TextBarItem(''));

Object.keys(presets).forEach(key => {
  bar.add(
    new BarItem([redProgress, blueProgress], {
      options: {
        ...presets[key],
        formatter: new BarsFormatter([chalk.yellowBright, chalk.blueBright]),
      },
      template: stringTemplate(
        ` ${key.padEnd(
          keyLength,
          ' ',
        )}: [{bars}] {percentage}/{percentage} ETA: {eta}/{eta} speed: {speed}/{speed} duration: {duration}/{duration} {value}/{total}/{value}/{total}`,
      ),
    }),
  );
});

bar.start();

const progresses = [progress, redProgress, blueProgress];

loopProgresses(progresses);
