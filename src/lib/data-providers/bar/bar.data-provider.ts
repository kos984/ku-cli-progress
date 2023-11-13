import { IProgress } from '../../interfaces/progress.interface';
import { IBarOptions } from '../../interfaces/bar-options.interface';
import { BarDataResult } from './bar.data-result';

interface IProgressInfo {
  size: number;
  delta: number;
  progress: IProgress;
  index: number;
}

export class BarDataProvider {
  protected options: IBarOptions = {
    completeChar: '=',
    resumeChar: '-',
    width: 40,
    glue: '',
  };

  public constructor(options: Partial<IBarOptions>) {
    this.options = { ...this.options, ...options };
  }

  public getProviders(): {
    bar: (progress: IProgress, progresses: IProgress[]) => BarDataResult;
    bars: (progress: IProgress, progresses: IProgress[]) => BarDataResult;
  } {
    return {
      bar: this.bar.bind(this),
      bars: this.bars.bind(this),
    };
  }

  protected bar(progress: IProgress): BarDataResult {
    return this.renderBar(progress.getProgress(), progress);
  }

  protected bars(progress: IProgress, progresses: IProgress[]): BarDataResult {
    return this.renderBars(progresses);
  }

  protected renderBar(donePercent: number, progress: IProgress): BarDataResult {
    const done = donePercent * this.options.width;
    const parts = this.getBarParts({
      size: Math.round(done),
      delta: done - Math.floor(done),
      progress,
      extraChar: true,
    });
    const result = new BarDataResult(
      [
        {
          str: parts.done,
          progress,
        },
        {
          str: parts.left,
          progress: undefined,
        },
      ],
      this.options.glue,
    );
    return result;
  }

  protected getBarParts(params: {
    progress: IProgress;
    delta: number;
    extraChar: boolean;
    size: number;
  }): { left: string; done: string } {
    const { size } = params;
    if (!this.options.completeChars?.length) {
      return {
        done: this.options.completeChar.repeat(size),
        left: this.options.resumeChar.repeat(this.options.width - size),
      };
    }
    return this.getBarPartsWithCompleteChars(params);
  }

  protected getBarPartsWithCompleteChars(params: {
    size: number;
    delta: number;
    extraChar: boolean;
    progress: IProgress;
  }): { left: string; done: string } {
    const { size, delta, extraChar } = params;
    // for multi bar line, lest handle round case, if delta >= 0.5 then render char
    const criteria = extraChar ? 0 : 0.5 - 0.001;
    const maxIndex = this.options.completeChars.length - 1;
    const completeChar =
      delta > criteria
        ? this.options.completeChars[Math.round(delta * maxIndex)]
        : '';
    const repeatSize = size ? size - Math.round(delta) : size;
    return {
      done: this.options.completeChar.repeat(repeatSize) + completeChar,
      left: this.options.resumeChar.repeat(
        this.options.width - repeatSize - (completeChar ? 1 : 0),
      ),
    };
  }

  private calculateProgressInfo(
    progress: IProgress,
    width,
    index,
  ): IProgressInfo {
    const done = progress.getProgress() * width;
    return {
      size: Math.round(done),
      delta: done - Math.floor(done),
      progress,
      index,
    };
  }

  private isExtraCharRequired(
    progresses: IProgress[],
    index,
    current: IProgressInfo,
  ): boolean {
    return (
      index === progresses.length - 1 &&
      this.options.completeChars?.length &&
      progresses.length > 1 &&
      current.size < current.progress.getProgress() * this.options.width
    );
  }

  // eslint-disable-next-line max-lines-per-function
  protected renderBars(progresses: IProgress[]): BarDataResult {
    const { resumeChar, width } = this.options;
    // const result = new BarDataResult(this.options.glue);
    const result: { str: string; progress: IProgress }[] = [];
    const leftLength = progresses
      .map((progress, index) =>
        this.calculateProgressInfo(progress, width, index),
      )
      .sort((a, b) => Math.sign(a.size - b.size))
      .reduce(
        (prev, current, index) => {
          const extraChar = this.isExtraCharRequired(
            progresses,
            index,
            current,
          );
          const length = current.size - prev.size;
          if (length > 0) {
            result.push({
              str: this.getBarParts({
                progress: current.progress,
                delta: current.delta,
                extraChar,
                size: length,
              }).done,
              progress: current.progress,
            });
          }
          return { size: current.size + (extraChar ? 1 : 0) };
        },
        { size: 0 },
      );

    if (width - leftLength.size > 0) {
      result.push({
        str: resumeChar.repeat(width - leftLength.size),
        progress: undefined,
      });
    }
    return new BarDataResult(result, this.options.glue);
  }
}
