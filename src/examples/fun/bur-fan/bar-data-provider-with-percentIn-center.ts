import { BarDataProvider, BarDataResult, IProgress } from 'ku-progress-bar';

export class BarDataProviderWithPercentInCenter extends BarDataProvider {
  public getData(progress: IProgress, progresses: IProgress[]): BarDataResult {
    // return super.getData(progress, progresses);
    return this.bars(progress, progresses);
  }

  // eslint-disable-next-line max-lines-per-function
  protected format(
    barDataResult: BarDataResult,
    progress: IProgress,
    progresses: IProgress[],
  ): BarDataResult {
    const start = 16;
    let index = 0;
    const text = ' 23.23% sdsdf ';
    let textIndex = 0;
    for (const item of barDataResult) {
      if (index + item.str.length < start || textIndex >= text.length) {
        index += item.str.length;
        continue;
      }
      const buff = [...item.str];
      for (
        let j = start - index;
        j < item.str.length && textIndex < text.length;
        j++, textIndex++
      ) {
        buff[j] = text[textIndex];
      }
      index = start;
      item.str = buff.join('');
    }
    return super.format(barDataResult, progress, progresses);
  }
}
