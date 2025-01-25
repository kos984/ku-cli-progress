import {
  Bar,
  BarsFormatter,
  BarItem,
  presets,
  Progress,
} from 'ku-progress-bar';
import * as chalk from 'chalk';
import { loopProgresses } from '../helpers/loop-progresses';

export const bar = new Bar().start();

const progresses = [
  new Progress({ total: 1000, start: 100 }),
  new Progress({ total: 1000 }),
];

bar.add(
  new BarItem(progresses, {
    options: {
      ...presets.shades,
      formatter: new BarsFormatter([chalk.green, chalk.yellowBright]),
    },
    template: (read, write) => {
      const readString = `read: ${read.value}/${read.total} ( ${read.percentage}% eta: ${read.etaHumanReadable})`;
      const writeString = `write: ${write.value}/${write.total} ( ${write.percentage}% eta: ${write.etaHumanReadable})`;
      return `[${read.bars}] ${chalk.green(readString)} ${chalk.yellowBright(
        writeString,
      )}`;
    },
  }),
);

loopProgresses(progresses);
