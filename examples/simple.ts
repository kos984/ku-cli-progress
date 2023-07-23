import { Bar } from '../src/bar';
import { Progress } from '../src/progress';

const progress = new Progress({ total: 1000 });

const bar = new Bar([progress]);

progress.increment(300);

bar.renderBars();
