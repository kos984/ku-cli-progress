import { Bar, Progress } from '../';

const progress = new Progress({ total: 1000 });

const bar = new Bar().addProgress(progress);

progress.increment(300);

bar.render();
