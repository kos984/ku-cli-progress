import { IProgress } from '../interfaces/progress.interface';
import { BarDataResult } from '../data-providers/bar/bar.data-result';

export class BarsFormatter {
  constructor(protected formatters: ((str: string) => string)[]) {}

  public formatter = (
    str: BarDataResult,
    _: IProgress,
    progresses: IProgress[],
  ): BarDataResult => {
    const result = str;
    if (!(result instanceof BarDataResult)) {
      return str;
    }
    for (const item of result) {
      const index = progresses.findIndex(
        progress => progress === item.progress,
      );
      const formatter = this.formatters[index];
      if (formatter) {
        item.str = formatter(item.str);
      }
    }
    return str;
  };
}
