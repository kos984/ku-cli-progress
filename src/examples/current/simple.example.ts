import { Progress, Bar } from '../..';
import { loopProgresses } from '../helpers/loop-progresses';

const progress = new Progress({ total: 1000 });

new Bar().addProgress(progress).start();

loopProgresses([progress], () => 5);
