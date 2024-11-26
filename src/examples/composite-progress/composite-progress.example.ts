import {
  Bar,
  BarsFormatter,
  EtaDataProvider,
  presets,
  Progress,
} from '../../index';
import { BarItem } from '../../lib/bar-items/bar-item';
import * as chalk from 'chalk';
import { loopProgresses } from '../helpers/loop-progresses';

export const bar = new Bar().start();

const progresses = [
  new Progress({ total: 10000, start: 300 }),
  new Progress({ total: 10000 }),
];

bar.add(
  new BarItem<{
    dataProviders: { etaHumanReadable2: string; etaHumanReadable3: string };
  }>(progresses, {
    options: {
      ...presets.shades,
      formatter: new BarsFormatter([chalk.green, chalk.yellowBright]),
    },
    template: (
      {
        value: v1,
        bars,
        etaHumanReadable: eta1,
        total,
        percentage: percentage1,
      },
      { value: v2, etaHumanReadable: eta2, percentage: percentage2 },
    ) => {
      return `[${bars}] ${v1} (${v2}) total: ${total} ${percentage1}% (${percentage2}%) ETA: ${eta1} (${eta2})`;
    },
    dataProviders: {
      etaHumanReadable: new EtaDataProvider({
        formatFunction: EtaDataProvider.presets.simple,
      }),
    },
  }),
);

loopProgresses(progresses, () => Math.random() * 10);
