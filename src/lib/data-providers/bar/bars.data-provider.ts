import { BarDataProvider } from './bar.data-provider';
import { IProgress } from '../../interfaces/progress.interface';
import { BarDataResult } from './bar.data-result';

export class BarsDataProvider extends BarDataProvider {
  public getData(progress: IProgress, progresses: IProgress[]): BarDataResult {
    return this.bars(progress, progresses);
  }
}
