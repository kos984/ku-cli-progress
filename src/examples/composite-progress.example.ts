import { Bar, BarItem, BarsFormatter, presets, Progress } from '../';
import * as chalk from 'chalk';
import { loopProgresses } from './helpers';

const bar = new Bar().start();
const progresses = [
  new Progress({ total: 1000, start: 300 }),
  new Progress({ total: 1000 }),
];
bar.add(
  new BarItem(progresses, {
    options: presets.shades,
    formatters: {
      bars: new BarsFormatter([chalk.green, chalk.yellowBright]),
    },
  }),
);

loopProgresses(progresses, () => Math.random() * 10);
