import { Progress, Bar, BarDataResult, presets } from '../../../index';
import { BarItem } from '../../../lib/bar-items/bar-item/bar-item';
import { BarFunDataProvider } from './bar-fun.data-provider';

const progress = new Progress({ total: 1000 });

const bar = new Bar();
const bbb = bar;

bar.add(
  new BarItem<{ dataProviders: { barFun: BarDataResult } }>(progress, {
    options: presets.braille,
    template: ({ value, bar, barFun }) => {
      bbb.logWrap(() => {
        // console.log(barFun);
      });
      return `[${bar}]\n\r[${barFun}] ${value}`;
    },
    dataProviders: {
      barFun: new BarFunDataProvider(presets.braille).getProviders().bar,
    },
  }),
);

// progress.increment(300);

// bar.render();
bar.start();

setInterval(() => {
  progress.increment(1);
}, 200);
