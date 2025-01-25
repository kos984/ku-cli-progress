#!/usr/bin/env tsx

// https://jsfiddle.net/sindresorhus/2eLtsbey/embedded/result/
// https://www.npmjs.com/package/cli-spinners

import {
  Bar,
  BarsFormatter,
  BarItem,
  presets,
  Progress,
  SpinnerDataProvider,
} from 'ku-progress-bar';
import * as chalk from 'chalk';
import { loopProgresses } from '../helpers/loop-progresses';
import { default as spinners } from 'cli-spinners';

export const bar = new Bar().start();

const progresses = [
  new Progress({ total: 1000, start: 100 }),
  new Progress({ total: 1000 }),
];

bar.add(
  new BarItem<{ dataProviders: { spinner: string } }>(progresses, {
    options: {
      // completeChar: spinners.aesthetic.frames[0][1],
      // resumeChar: spinners.aesthetic.frames[1][0],
      ...presets.shades,
      formatter: new BarsFormatter([chalk.green, chalk.yellowBright]),
    },
    dataProviders: {
      spinner: new SpinnerDataProvider({
        chars: spinners.aesthetic.frames,
        delay: spinners.aesthetic.interval,
      }),
    },
    template: (read, write) => {
      const readString = `${read.spinner}  read: ${read.value}/${read.total} ( ${read.percentage}% eta: ${read.etaHumanReadable})`;
      const writeString = `write: ${write.value}/${write.total} ( ${write.percentage}% eta: ${write.etaHumanReadable})`;
      return `[${read.bars}] ${chalk.green(readString)} ${chalk.yellowBright(
        writeString,
      )}`;
    },
  }),
);

loopProgresses(progresses);
