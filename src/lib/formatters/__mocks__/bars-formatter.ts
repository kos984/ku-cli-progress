import { IProgress } from '../../interfaces/progress.interface';
import { BarDataResult } from '../../data-providers/bar/bar.data-result';

export class BarsFormatter {
  constructor(public formatters: ((str: string) => string)[]) {}

  public formatter = (
    str: BarDataResult,
    _: IProgress,
    progresses: IProgress[],
  ): BarDataResult => {
    if (!(str instanceof BarDataResult)) {
      return str;
    }
    const result = str;
    let i = 0;
    for (const item of result) {
      const index = progresses.findIndex(
        progress => progress === item.progress,
      );
      const formatter = this.formatters[index];
      if (formatter) {
        item.str = i.toString().repeat(item.str.length);
      }
      i++;
    }
    return result;
  };
}
