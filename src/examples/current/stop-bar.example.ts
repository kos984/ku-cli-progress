import { Progress, Bar, BarItem, presets } from '../../';

const progress = new Progress({ total: 100 });

const bar = new Bar();

bar.add(new BarItem(progress, { options: presets.rect }));

console.log('start');
bar.start(true);
progress.increment();

const logger = bar.loggerWrap<typeof console>(console);

logger.log('test log');
// logger.dir(bar);
logger.assert(false, 'test assert');

setTimeout(() => {
  bar.stop();
  console.log('stopping');
}, 3000);
