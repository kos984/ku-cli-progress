import { Progress, Bar } from '../..';
import { BarItem } from '../../lib/bar-item';

const progress = new Progress({ total: 1000 });

const bar = new Bar();

bar.add(
  new BarItem(progress, {
    template: ({ value, bar }) => `[${bar}] ${value}`,
  }),
);

// progress.increment(300);

// bar.render();
bar.start();

setInterval(() => {
  progress.increment(1);
}, 5);
