import { Progress } from '../lib/progress';
import { Bar } from '../lib/bar';
import { BarItem } from '../lib/bar-item';

const bar = new Bar();

for (let i = 0; i < 30; i++) {
  const progress = new Progress({ total: 1000 });
  progress.increment(Math.floor(Math.random() * 1000));
  bar.add(new BarItem(progress));
}

bar.render();
