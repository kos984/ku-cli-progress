// FIXME: remove me or move out

import { IProgress } from '../../../interfaces/progress.interface';

export type IFormatter = (
  str: string,
  progress: IProgress,
  progresses: IProgress[],
) => string;
