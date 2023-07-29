import { Bar } from '../bar';
import { Progress } from '../progress';

const progress = new Progress({ total: 1000 });

const bar = new Bar([progress]);

progress.increment(300);

bar.renderBars();
