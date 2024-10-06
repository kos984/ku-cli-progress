import { Progress } from '../lib/progress';
import { BarItem } from '../lib/bar-item';

const total = 100;
const progress = new Progress<string>({ total });
new BarItem(progress);
