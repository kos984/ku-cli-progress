import { IBarOptions } from './interfaces/bar-options.interface';
import { IProgress } from './interfaces/progress.interface';
import { IBarItem } from './interfaces/bar-item.interface';

export interface IFormatters {
  [key: string]: (
    str: string,
    progress: IProgress,
    progresses: IProgress[],
  ) => string;
}

export interface IDataProviders {
  [key: string]: (progress: IProgress, progresses: IProgress[]) => string;
}

export interface IParams {
  tagDelimiter?: string;
  template?: string;
  options?: Partial<IBarOptions>;
  formatters?: IFormatters;
  dataProviders?: IDataProviders;
}

interface IProgressInfo {
  size: number;
  delta: number;
  progress: IProgress;
  index: number;
}

export class BarItem implements IBarItem {
  protected template!: string;
  protected tagDelimiter!: string;
  protected options: IBarOptions = {
    completeChar: '=',
    resumeChar: '-',
    width: 40,
    glue: '',
  };
  protected formatters!: IFormatters;
  protected dataProviders!: IDataProviders;
  protected progresses: IProgress[];

  public constructor(progresses: IProgress | IProgress[], params?: IParams) {
    this.progresses = Array.isArray(progresses) ? progresses : [progresses];
    this.tagDelimiter = params?.tagDelimiter ?? '_';
    this.template =
      params?.template ?? this.getDefaultTemplate(this.progresses);
    this.options = { ...this.options, ...params?.options };
    this.formatters = params?.formatters ?? {};
    this.dataProviders = this.getDataProviders(params?.dataProviders);
  }

  public getProgresses(): IProgress[] {
    return this.progresses;
  }

  public render(): string {
    const next = this.getCounterByProperty(this.progresses.length);
    return this.template.replace(/{([^{}]+)}/g, (match, prop) => {
      const [property, tag] = prop.split(this.tagDelimiter).reverse();
      const index = tag
        ? this.progresses.findIndex(p => p.getTag() === tag)
        : next(property);
      if (index < 0) return match;
      const progress = this.progresses[index];
      const value = this.getDataValue(property, progress);
      if (value === null) {
        return match;
      }
      if (this.formatters[prop]) {
        return this.formatters[prop](value, progress, this.progresses);
      }
      return value;
    });
  }

  protected getCounterByProperty(max) {
    const map = new Map();
    return key => {
      const index = map.get(key) ?? 0;
      map.set(key, index + 1);
      if (index >= max) {
        return -1;
      }
      return index;
    };
  }

  protected getDefaultTemplate(progresses) {
    if (progresses.length > 1) {
      return `[{bars}] ${progresses
        .map(() => '{percentage}')
        .join('/')} ETA: ${progresses
        .map(() => '{eta}')
        .join('/')} speed: ${progresses
        .map(() => '{speed}')
        .join('/')} duration: ${progresses
        .map(() => '{duration}')
        .join('/')} ${progresses.map(() => '{value}/{total}').join(' ')}`;
    }
    return '[{bar}] {percentage} ETA: {eta} speed: {speed} duration: {duration} {value}/{total}';
  }

  protected bar(donePercent: number, progress: IProgress): string {
    const done = donePercent * this.options.width;
    const parts = this.getBarParts({
      size: Math.round(done),
      delta: done - Math.floor(done),
      progress,
      extraChar: true,
    });
    return `${parts.done}${this.options.glue}${parts.left}`;
  }

  protected renderBarsLine(params: {
    size: number;
    delta: number;
    progress: IProgress<object>;
    extraChar: boolean;
  }): string {
    const line = this.getBarParts(params).done;
    const formatter =
      this.formatters[`${params.progress.getTag()}${this.tagDelimiter}bar`] ??
      this.formatters['bar'];
    return formatter ? formatter(line, params.progress, this.progresses) : line;
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
      this.progresses.length > 1 &&
      current.size < current.progress.getProgress() * this.options.width
    );
  }

  // eslint-disable-next-line max-lines-per-function
  protected renderBars(progresses: IProgress[]): string {
    const { resumeChar, width, glue } = this.options;
    const lines = [];
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
            lines.push(
              this.renderBarsLine({ ...current, extraChar, size: length }),
            );
          }
          return { size: current.size + (extraChar ? 1 : 0) };
        },
        { size: 0 },
      );

    if (width - leftLength.size > 0) {
      lines.push(resumeChar.repeat(width - leftLength.size));
    }
    return lines.join(glue);
  }

  protected getBarParts(params: {
    size: number;
    delta: number;
    extraChar: boolean;
    progress: IProgress;
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

  protected getDataValue = (key: string, item: IProgress): string | null => {
    const payload = item.getPayload();
    let value = payload[key] ?? null;
    value =
      value === null && this.dataProviders[key]
        ? this.dataProviders[key](item, this.progresses)
        : value;
    if (value === null) return value;
    return value;
  };

  // eslint-disable-next-line max-lines-per-function
  protected getDataProviders(dataProviders?: IDataProviders) {
    const formatNumber = (num: number, suffix: string): string => {
      if (!Number.isFinite(num)) return '\u221E';
      return num + suffix;
    };
    const formatEtaHumanReadable = (num: number): string => {
      if (!Number.isFinite(num)) return '\u221E';
      return [
        { period: 3600 * 24, name: 'd' },
        { period: 3600, name: 'h' },
        { period: 60, name: 'm' },
        { period: 1, name: 's' },
      ].reduce(
        ({ n, str }, { period, name }) => {
          return n > period
            ? { n: n % period, str: str + Math.floor(n / period) + name }
            : { n, str };
        },
        { n: num, str: '' },
      ).str;
    };
    return {
      bars: (progress, progresses) => this.renderBars(progresses),
      bar: progress => this.bar(progress.getProgress(), progress),
      speed: progress =>
        formatNumber(Math.round(progress.getEta().getSpeed()), '/s'),
      eta: progress => formatNumber(progress.getEta().getEtaS(), 's'),
      etaHumanReadable: progress =>
        formatEtaHumanReadable(progress.getEta().getEtaS()),
      value: progress => progress.getValue().toString(),
      total: progress => progress.getTotal().toString(),
      percentage: progress => Math.round(progress.getProgress() * 100) + '%',
      duration: progress =>
        Math.round(progress.getEta().getDurationMs() / 1000) + 's',
      ...dataProviders,
    };
  }
}
