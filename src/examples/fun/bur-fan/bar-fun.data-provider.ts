import { IProgress } from '../../../lib/interfaces/progress.interface';
import { IBarOptions } from '../../../lib/interfaces/bar-options.interface';
import { BarDataResult } from '../../../lib/data-providers/bar/bar.data-result';

export class BarFunDataProvider {
  protected options: IBarOptions = {
    completeChar: '=',
    resumeChar: '-',
    width: 40,
    glue: '',
  };

  protected buffer!: { char: string; filled: boolean }[];
  protected completeChar: string = '=';

  public constructor(options: Partial<IBarOptions>) {
    this.options = { ...this.options, ...options };
    this.buffer = new Array(this.options.width).fill({});
    this.completeChar = this.options.completeChar?.length
      ? this.options.completeChar[0]
      : this.options.completeChar;
  }

  public getData(progress: IProgress, progresses: IProgress[]): BarDataResult {
    return this.format(
      this.renderBar(progress.getProgress(), progress),
      progress,
      progresses,
    );
  }

  protected format(
    barDataResult: BarDataResult,
    progress: IProgress,
    progresses: IProgress[],
  ): BarDataResult {
    return this.options.formatter?.formatter
      ? this.options.formatter.formatter(barDataResult, progress, progresses)
      : barDataResult;
  }

  protected clearBuffer(): void {
    for (const item of this.buffer) {
      item.filled = false;
    }
  }

  protected fillPercent(progress: IProgress): void {
    const percentTextBuff = (
      ' ' +
      (progress.getProgress() * 100).toFixed(2) +
      '% '
    ).split('');
    const startPosition = Math.round(
      (this.options.width - percentTextBuff.length) / 2,
    );
    for (let i = 0; i < percentTextBuff.length; i++) {
      this.buffer[startPosition + i] = {
        char: percentTextBuff[i],
        filled: true,
      };
    }
  }

  protected setExtraChar(params: { done: number; doneInt: number }): void {
    const { done, doneInt } = params;
    const extraChar = this.getCompleteChar({
      delta: done - Math.floor(done),
      extraChar: true,
    });
    if (extraChar && this.buffer[doneInt].filled === false) {
      this.buffer[doneInt] = { char: extraChar, filled: true };
    }
  }

  protected getStringFromBuffer(
    start: number,
    end: number,
    char: string,
  ): string {
    return this.buffer
      .slice(start, end)
      .map(a => (a.filled ? a.char : char))
      .join('');
  }

  protected renderBar(donePercent: number, progress: IProgress): BarDataResult {
    this.clearBuffer();
    this.fillPercent(progress);

    const done = donePercent * this.options.width;
    const doneInt = Math.floor(done);
    this.setExtraChar({ done, doneInt });

    return new BarDataResult(
      [
        {
          str: this.getStringFromBuffer(0, doneInt, this.completeChar),
          progress,
        },
        {
          str: this.getStringFromBuffer(
            doneInt,
            this.options.width,
            this.options.resumeChar,
          ),
          progress: undefined,
        },
      ],
      this.options.glue,
    );
  }

  protected getCompleteChar(params: {
    delta: number;
    extraChar: boolean;
  }): string | undefined {
    const { extraChar, delta } = params;
    // for multi bar line, lest handle round case, if delta >= 0.5 then render char
    const criteria = extraChar ? 0 : 0.5 - 0.001;
    const maxIndex = this.options.completeChars.length - 1;
    return delta > criteria
      ? this.options.completeChars[Math.round(delta * maxIndex)]
      : undefined;
  }
}
