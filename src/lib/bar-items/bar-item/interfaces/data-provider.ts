import { IProgress } from '../../../interfaces/progress.interface';

export type IDataProvider<IResult> = (
  progress: IProgress,
  progresses: IProgress[],
) => IResult;
