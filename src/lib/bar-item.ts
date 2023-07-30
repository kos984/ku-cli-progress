import { IBarOptions } from './interfaces/bar-options.interface';
import { Progress } from './progress';

export interface IFormatters {
  [key: string]: (str: string, progress: Progress, progresses: Progress[]) => string;
}

export interface IDataProviders {
  [key: string]: (progress: Progress, progresses: Progress[]) => string;
}

export interface IParams {
  template?: string;
  options?: Partial<IBarOptions>;
  formatters?: IFormatters;
  dataProviders?: IDataProviders;
}

export class BarItem {

  protected template: string = `[{bar}] {percentage} ETA: {eta} speed: {speed} duration: {duration} {value}/{total}`;
  protected options: IBarOptions = {
    completeChar: '=',
    resumeChar: '-',
    width: 40,
    glue: '',
  };
  protected formatters!: IFormatters;
  protected dataProviders!: IDataProviders;

  public constructor(protected progresses: Progress[], params?: IParams) {
    this.template = params?.template ?? this.template;
    this.options = { ...this.options, ...params?.options };
    this.formatters = params?.formatters ?? {};
    this.dataProviders = {
      bars: (progress, progresses) => this.renderBars(progresses),
      bar: (progress) => this.bar(progress.getProgress()),
      speed: (progress) => Math.round(progress.getEta().getSpeed()) + '/s',
      eta: (progress) => progress.getEta().getEtaS() + 's',
      value: (progress) => progress.getValue().toString(),
      total: (progress) => progress.getTotal().toString(),
      percentage: (progress) => Math.round(progress.getProgress() * 100) + '%',
      duration: (progress) => Math.round(progress.getEta().getDurationMs() / 1000) + 's',
      ...params?.dataProviders,
    }
  }

  public getProgresses() {
    return this.progresses;
  }

  public renderBars(progresses: Progress[]): string {
    const { resumeChar, width, glue } = this.options;
    const lines = [];

    const leftLength = progresses
      .map((item, index) => ({
        size: Math.round(item.getProgress() * width),
        item,
        index,
      }))
      .sort((a, b) => Math.sign(a.size - b.size))
      .reduce((prev, current) => {
        const length = current.size - prev.size;
        if (length > 0) {
          let line = this.getBarParts(length > width ? width : length).done;
          const item = current.item;
          const formatter = this.formatters[`${item.getTag()}_bar`] ?? this.formatters['bar'];
          if (formatter) {
            line = formatter(line, current.item, progresses);
          }
          lines.push(line);
        }
        return current;
      }, { size: 0 });

    if (width - leftLength.size > 0) {
      lines.push(resumeChar.repeat(width - leftLength.size));
    }
    return lines.join(glue);
  }

  public render(): string {
    return this.template.replace(/{([^{}]+)}/g, (match, prop) => {
      const [property, tag] = prop.split('_').reverse();
      const index = tag ? this.progresses.findIndex(p => p.getTag() === tag) : 0;
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

  public getBarParts(size: number): { left: string; done: string } {
    return {
      done: this.options.completeChar.repeat(size),
      left: this.options.resumeChar.repeat(this.options.width - size)
    }
  }

  public bar(progress: number): string {
    const size =  Math.round(progress * this.options.width);
    const parts = this.getBarParts(size);
    return `${parts.done}${this.options.glue}${parts.left}`;
  }

  protected getDataValue = (key: string, item: Progress): string | null => {
    const payload = item.getPayload();
    let value = payload[key] ?? null;
    value = (value === null && this.dataProviders[key]) ? this.dataProviders[key](item, this.progresses) : value;
    if (value === null) return value;
    return value;
  };

}
