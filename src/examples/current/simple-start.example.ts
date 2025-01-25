import { Bar, Progress } from 'ku-progress-bar';
import { loopProgresses } from '../helpers/loop-progresses';

const progress = new Progress({ total: 1000 });

const bar = new Bar().addProgress(progress);

bar.start();

loopProgresses([progress], { getDelay: () => 5 });
