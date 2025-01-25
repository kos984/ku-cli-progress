#!/usr/bin/env tsx

import {
  BarItem,
  Progress,
  Bar,
  BarDataResult,
  presets,
  BarsFormatter,
} from 'ku-progress-bar';
import { BarFunDataProvider } from './bar-fun.data-provider';
import { loopProgresses } from '../../helpers/loop-progresses';
import chalk from 'chalk';
import { BarDataProviderWithPercentInCenter } from './bar-data-provider-with-percentIn-center';
import { BarsFormatterWithTextInCenter } from './bars-formatter-with-text-in-center';

const progress = new Progress({ total: 1000, start: 300 });
const progress1 = new Progress({ total: 1000, start: 400 });

const bar = new Bar();

bar.add(
  new BarItem<{ dataProviders: { barFun: BarDataResult } }>(
    [progress, progress1],
    {
      options: {
        ...presets.braille,
        formatter: new BarsFormatter([chalk.yellowBright, chalk.green]),
      },
      template: ({ value, bar, bars, barFun }) => {
        return `[${bar}] [${bars}]\n\r[${barFun}] ${value}`;
      },
      dataProviders: {
        barFun: new BarFunDataProvider({
          ...presets.braille,
          formatter: new BarsFormatter([chalk.yellowBright, chalk.green]),
        }),
      },
    },
  ),
);
bar.start();

bar.add(
  new BarItem<{ dataProviders: { barFun: BarDataResult } }>(
    [progress, progress1],
    {
      options: {
        ...presets.braille,
        formatter: new BarsFormatter([chalk.yellowBright, chalk.green]),
      },
      template: ({ value, bar, bars, barFun }) => {
        return `[${bar}] [${bars}]\n\r[${barFun}] ${value}`;
      },
      dataProviders: {
        barFun: new BarDataProviderWithPercentInCenter({
          ...presets.braille,
          formatter: new BarsFormatter([chalk.yellowBright, chalk.green]),
        }),
      },
    },
  ),
);

bar.add(
  new BarItem<{ dataProviders: { barFun: BarDataResult } }>(
    [progress, progress1],
    {
      options: {
        ...presets.braille,
        formatter: new BarsFormatterWithTextInCenter([
          chalk.yellowBright,
          chalk.green,
        ]),
      },
      template: ({ value, bar, bars, barFun }) => {
        return `[${bar}] [${bars}]\n\r[${barFun}] ${value}`;
      },
      dataProviders: {
        barFun: new BarDataProviderWithPercentInCenter({
          ...presets.braille,
          formatter: new BarsFormatter([chalk.yellowBright, chalk.green]),
        }),
      },
    },
  ),
);

loopProgresses([progress, progress1], { getDelay: () => 50 });
