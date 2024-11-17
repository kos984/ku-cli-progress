import { BarDataResult } from '../../../data-providers/bar/bar.data-result';
import { IProgress } from '../../../interfaces/progress.interface';

export interface IDataProviders {
  bars: BarDataResult;
  bar: BarDataResult;
  speed: number;
  eta: number;
  etaHumanReadable: string;
  value: number;
  total: number;
  percentage: number;
  duration: number;
  progress: IProgress;
  progresses: IProgress[];
}
