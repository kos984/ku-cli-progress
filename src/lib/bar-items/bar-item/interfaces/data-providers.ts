import { BarDataResult } from '../../../data-providers/bar/bar.data-result';
import { IProgress } from '../../../interfaces/progress.interface';

export interface IDataProviders {
  bars: BarDataResult;
  bar: BarDataResult;
  speed: number;
  eta: number;
  value: number;
  total: number;
  percentage: number;
  duration: number;
  progress: IProgress;
  progresses: IProgress[];
}
