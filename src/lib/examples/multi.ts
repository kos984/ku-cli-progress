import { Progress } from '../progress';
import { Bar } from '../bar';
import { BarItem } from '../bar-item';

const bar = new Bar();

const progresses: Progress[] = [];
for (let i = 0; i < 30; i++) {
  const progress = new Progress({ total: 1000 });
  progress.increment(Math.floor(Math.random() * 1000));
  progresses.push(progress);
  bar.add(new BarItem([progress]));
}

bar.render();
