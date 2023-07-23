import { IBarOptions } from './interfaces/bar-options.interface';
import { Progress } from './progress';

export interface IFormatters {
  [key: string]: (str: string) => string;
}

export class Bar {
  public constructor(protected progresses: Progress[], protected template: string, protected options: IBarOptions, protected formatters: IFormatters = {}) {
  }

  public renderBars(progresses: Progress[]): string {
    const { resumeChar, width, glue } = this.options;
    const lines = [];

    const leftLength = progresses
      .map((item, index) => ({
        size: Math.round(item.getProgress() * width),
        item,
      }))
      .sort((a, b) => Math.sign(a.size - b.size))
      .reduce((prev, current) => {
        const length = current.size - prev.size;
        if (length > 0) {
          let line = this.getBarParts(length > width ? width : length, this.options).done;
          if (this.formatters[`${current.item.getTag()}_bar`]) {
            // FIXME: not perfect
            line = this.formatters[`${current.item.getTag()}_bar`](line);
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
    const options = this.options;
    return this.template.replace(/{([^}]+)}/g, (match, prop) => {
      const [property, tag] = prop.split('_').reverse();
      const progress = tag ? this.progresses.find(p => p.getTag() === tag) : this.progresses[0];
      const value = this.getDataValue(property, options, progress!);
      if (value === null) {
        return match;
      }
      if (this.formatters[prop]) {
        return this.formatters[prop](value);
      }
      return value;
    });
  }

  public getBarParts(size: number, options: IBarOptions): { left: string; done: string } {
    return {
      done: options.completeChar.repeat(size),
      left: options.resumeChar.repeat(options.width - size)
    }
  }

  public bar(progress: number, options: IBarOptions): string { // TODO: format/color
    const size =  Math.round(progress * options.width);
    const parts = this.getBarParts(size, options);
    return `${parts.done}${options.glue}${parts.left}`;
  }

  protected getDataValue = (key: string, options: IBarOptions, item: Progress): string | null => {
    const map: { [key: string]: () => string } = {
      bar: () => this.bar(item.getProgress(), options), // FIXME: remove options ??
      bars: () => this.renderBars(this.progresses),
      // speed: () => Math.round(this.eta.getSpeed()) + '/s',
      // eta: () => this.eta.getEtaS() + 's',
      value: () => item.getValue().toString(),
      total: () => item.getTotal().toString(),
      percentage: () => Math.round(item.getProgress() * 100) + '%',
      // duration: () => Math.round(item.eta.getDurationMs() / 1000) + 's',
    }
    let value = map[key] ? map[key]() : null;
    if (value === null) return value;
    // return this.payload && this.payload[key] ? this.payload[key] : null;
    return value;
  };

}
