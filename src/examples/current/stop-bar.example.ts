import { Progress, Bar, BarItem, presets } from '../../';

const progress = new Progress({ total: 100 });

const bar = new Bar();

bar.add(new BarItem(progress, { options: presets.rect }));

console.log('start');
bar.start(1000);
progress.increment();

const logger = bar.wrapLogger<typeof console>(console);

logger.log('test log');
// logger.dir(bar);
logger.assert(false, 'test assert');

setTimeout(() => {
  bar.stop();
  console.log('stopping');
}, 3000);
