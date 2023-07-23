import { Progress } from '../progress';
import { BarsContainer } from '../bars-container';
import { Bar } from '../bar';

const barsContainer = new BarsContainer();

const progresses: Progress[] = [];
for (let i = 0; i < 30; i++) {
  const progress = new Progress({ total: 1000 });
  progress.increment(Math.floor(Math.random() * 1000));
  progresses.push(progress);
  barsContainer.add(new Bar([progress]));
}

barsContainer.render();
