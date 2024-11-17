import { BarDataResult } from '../data-providers/bar/bar.data-result';
import { IProgress } from './progress.interface';

export interface IBarOptions {
  completeChar: string;
  completeChars?: string[];
  resumeChar: string;
  width: number;
  glue: string;
  formatter?: {
    // FIXME: should be interface
    formatter: (
      str: BarDataResult,
      progress: IProgress,
      progresses: IProgress[],
    ) => BarDataResult;
  };
}
