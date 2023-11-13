import {
  Bar,
  BarDataProvider,
  BarDataResult,
  BarItem,
  BarsFormatter,
  IBarFormatter,
  IDataProvider,
  IObjectFormatter,
  IProgress,
  presets,
  Progress,
} from '../';
import { loopProgresses } from './helpers';
import * as chalk from 'chalk';

const progress = new Progress({ total: 1000 });
const progress2 = new Progress({ total: 1000, start: 500, tag: 'second' });

const progresses = [progress, progress2];

const providers = new BarDataProvider({ ...presets.braille });

const barItem = new BarItem<
  { bars2: IBarFormatter | IObjectFormatter<IBarFormatter> },
  {
    bar2: (progress: IProgress, progresses: IProgress[]) => BarDataResult;
    bars2: (progress: IProgress, progresses: IProgress[]) => BarDataResult;
  }
>(progresses, {
  template: `bar2: {bar2}\nbars2: {bars2}\n{value}/{total}`,
  dataProviders: {
    bar2: providers.getProviders().bar,
    bars2: providers.getProviders().bars,
  },
  formatters: {
    bars2: new BarsFormatter([chalk.green, chalk.yellowBright, chalk.blue]),
  },
});
const bar = new Bar().add(barItem);

const barItem2 = new BarItem<
  { bars2: IBarFormatter | IObjectFormatter<IBarFormatter> },
  {
    bars2: IDataProvider<BarDataResult>;
    bar2: IDataProvider<BarDataResult>;
  }
>(progresses, {
  template: ({ bars2, value, total }) => {
    return `BarItemV2: ${bars2} ${value}/${total} | ${value}/${total} [${value}, ${value[0]}, ${value['second']}]`;
  },
  dataProviders: {
    bar2: providers.getProviders().bar,
    bars2: providers.getProviders().bars,
  },
  formatters: {
    bars2: result => {
      const colors = [chalk.green, chalk.yellowBright, chalk.blue];
      const a = [...result];
      // see src/lib/formatters/bars-formatter.ts
      a.forEach((value: { str: string; progress: IProgress }, index) => {
        // eslint-disable-next-line no-param-reassign
        value.str = colors[index](value.str);
      });
      return result;
    },
  },
});
bar.add(barItem2);

bar.start();

const intervals = loopProgresses([progress, progress2]);
progress.on('update', e => {
  if (e.new.value >= 300) {
    clearInterval(intervals[0]);
  }
});
