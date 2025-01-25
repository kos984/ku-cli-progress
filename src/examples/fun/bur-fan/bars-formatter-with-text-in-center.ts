import {
  BarDataResult,
  BarsFormatter,
  IBarDataResultPart,
  IProgress,
} from 'ku-progress-bar';

export class BarsFormatterWithTextInCenter extends BarsFormatter {
  protected format(
    barDataResult: BarDataResult,
    _: IProgress,
    progresses: IProgress[],
  ): BarDataResult {
    const { start, text } = this.getText(_);
    let index = 0;
    let textIndex = 0;
    for (const item of barDataResult) {
      if (index + item.str.length < start || textIndex >= text.length) {
        index += item.str.length;
        continue;
      }
      textIndex = this.updatePart({
        textIndex,
        item,
        text,
        start: start - index,
      });
      index = start;
    }
    return super.format(barDataResult, _, progresses);
  }

  protected updatePart(params: {
    textIndex: number;
    item: IBarDataResultPart;
    text: string;
    start: number;
  }): number {
    const { item, text } = params;
    let textIndex = params.textIndex;
    const buff = [...item.str];
    for (
      let j = params.start;
      j < item.str.length && textIndex < text.length;
      j++, textIndex++
    ) {
      buff[j] = text[textIndex];
    }
    item.str = buff.join('');
    return textIndex;
  }

  protected getText(progress: IProgress) {
    const percent =
      ' ' + (progress.getProgress() * 100).toFixed(2).padStart(5, '0') + '% ';
    const start = Math.round(20 - percent.length / 2);
    return {
      text: percent,
      start,
    };
  }
}
