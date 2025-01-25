import { IProgress } from '../interfaces/progress.interface';
import {
  BarDataResult,
  IBarDataResultPart,
} from '../data-providers/bar/bar.data-result';

type IFormatter = (str: string) => string;

export class BarsFormatter {
  constructor(public formatters: IFormatter[]) {}

  public formatter = (
    str: BarDataResult,
    _: IProgress,
    progresses: IProgress[],
  ): BarDataResult => {
    if (!(str instanceof BarDataResult)) {
      return str;
    }
    return this.format(str, _, progresses);
  };

  protected format(
    str: BarDataResult,
    _: IProgress,
    progresses: IProgress[],
  ): BarDataResult {
    const result = str;
    for (const item of result) {
      const formatter = item.progress
        ? this.getFormatterByProgress(progresses, item)
        : this.getFormatterForLeftProgressString(result);
      if (formatter) {
        item.str = formatter(item.str);
      }
    }
    return result;
  }

  protected getFormatterByProgress(
    progresses: IProgress[],
    item: IBarDataResultPart,
  ): IFormatter | undefined {
    const index = progresses.findIndex(progress => progress === item.progress);
    return this.formatters[index];
  }

  protected getFormatterForLeftProgressString(
    result: BarDataResult,
  ): IFormatter | undefined {
    if (this.formatters.length == result.getParts().length) {
      return this.formatters[this.formatters.length - 1];
    }
    return undefined;
  }
}
