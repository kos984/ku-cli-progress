import {
  Bar,
  BarsFormatter,
  EtaDataProvider,
  etaFunctionPresets,
  IProgress,
  presets,
  Progress,
} from '../../../index';
import { BarItem } from '../../../lib/bar-items/bar-item/bar-item';
import * as chalk from 'chalk';
import { loopProgresses } from '../../legacy/helpers';

const bar = new Bar().start();
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
