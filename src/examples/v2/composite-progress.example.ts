import {
  Bar,
  BarsFormatter,
  EtaDataProvider,
  etaFunctionPresets,
  IProgress,
  presets,
  Progress,
} from '../../';
import { BarItem } from '../../lib/bar-item';
import * as chalk from 'chalk';
import { loopProgresses } from '../helpers';

const bar = new Bar().start();
const progresses = [
  new Progress({ total: 10000000, start: 300 }),
  new Progress({ total: 10000000 }),
];

bar.add(
  new BarItem<{
    dataProviders: { etaHumanReadable2: string; etaHumanReadable3: string }
  }>(progresses, {
    options: presets.shades,
    template: ({
      value,
      bars,
      etaHumanReadable,
      etaHumanReadable3,
      etaHumanReadable2,
      eta,
    }) => {
      return `[${bars}] ${value} ${eta} ${etaHumanReadable} ${etaHumanReadable2} ${etaHumanReadable3}`;
    },
    formatters: {
      bars: new BarsFormatter([chalk.green, chalk.yellowBright]),
    },
    dataProviders: {
      value: (progress: IProgress) => {
        return progress.getValue() * 100 + '';
      },
      etaHumanReadable2: new EtaDataProvider().getProviders().etaHumanReadable,
      etaHumanReadable3: new EtaDataProvider(
        etaFunctionPresets.etaFormatFunctionTime,
      ).getProviders().etaHumanReadable,
    },
  }),
);

loopProgresses(progresses, () => Math.random() * 10);
