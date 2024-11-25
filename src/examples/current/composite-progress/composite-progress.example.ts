import {
  Bar,
  BarsFormatter,
  EtaDataProvider,
  etaFunctionPresets,
  presets,
  Progress,
} from '../../../index';
import { BarItem } from '../../../lib/bar-items/bar-item';
import * as chalk from 'chalk';
import { loopProgresses } from '../../helpers/loop-progresses';

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
        value,
        bars,
        etaHumanReadable,
        etaHumanReadable3,
        etaHumanReadable2,
        eta,
      },
      data,
    ) => {
      return `[${bars}] value: ${value} | value2: ${data.value} ETA: ${eta} etaString: ${etaHumanReadable} etaString2: ${etaHumanReadable2} etaString3:${etaHumanReadable3}`;
    },
    dataProviders: {
      etaHumanReadable2: new EtaDataProvider().getProviders().etaHumanReadable,
      etaHumanReadable3: new EtaDataProvider({
        formatFunction: etaFunctionPresets.etaFormatFunctionTime,
      }).getProviders().etaHumanReadable,
    },
  }),
);

loopProgresses(progresses, () => Math.random() * 10);
