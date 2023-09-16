import { Progress, Bar, BarItem, presets } from '../';

const progress = new Progress({ total: 100 });

const bar = new Bar();

bar.add(new BarItem(progress, { options: presets.rect }));

console.log('start');
bar.start();

setTimeout(() => {
  console.log('stopping');
  bar.stop();
}, 3000);
