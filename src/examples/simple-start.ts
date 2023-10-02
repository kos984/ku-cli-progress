import { Bar, Progress } from '../';
import { loopProgresses } from './helpers';

const progress = new Progress({ total: 1000 });

const bar = new Bar().addProgress(progress);

bar.start();

const intervals = loopProgresses([progress]);
progress.on('update', e => {
  if (e.new.value >= 300) {
    clearInterval(intervals[0]);
  }
});
