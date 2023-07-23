import { Bar } from '../src/bar';
import { Progress } from '../src/progress';

const progresses: Progress[] = [];
for (let i = 0; i < 30; i++) {
  const progress = new Progress({ total: 1000 });
  progress.increment(Math.floor(Math.random() * 1000));
  progresses.push(progress);
}

const bar = new Bar(progresses);

bar.start().catch(console.error);
