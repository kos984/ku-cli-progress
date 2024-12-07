import { IProgress } from '../../../interfaces/progress.interface';

export type IDataProvider<IResult, IPayload = unknown> = (
  progress: IProgress<IPayload>,
  progresses: IProgress<IPayload>[],
) => IResult;
