import { Progress } from './progress';
// @ts-ignore
import chalk from 'chalk';

export interface IBarParams {
  completeChar: string;
  resumeChar: string;
  color: (str: string) => string
  width: number;
}

export interface IRenderParams {
  template: string;
  bar: Partial<IBarParams>
  format: {
    [key: string]: (str: string) => string
  }
}

export class Render {
  protected params: IRenderParams & { bar: IBarParams };
  protected colors: Array<(s: string) => string> = [];
  public constructor(params: Partial<IRenderParams> = {}) {
    this.params = {
      template: `[{bar}] {eta} {value}/{total}`,
      ...params,
      bar: {
        completeChar: '=',
        resumeChar: '-',
        width: 40,
        color: s => s,
        ...params.bar,
      },
      format: {
        bar: (srt: string) => srt,
        eta: (str: string) => str,
        value: (str: string) => str,
        total: (str: string) => str,
        ...params.format,
      },
    }
  }

  public render(progresses: Progress[]): string {
    if (!progresses.length) {
      return '';
    }
    return this.params.template.replace(/{([^}]+)}/g, (match, p) => {
      const [property, tag] = p.split('_').reverse();
      const progress = tag ? progresses.find(p => p.getTag() === tag) : progresses[0];
      if (!progress) {
        return match;
      }
      if (property === 'bars' && progresses.length > 1) {
        // do not allow format bars, just return
        return this.renderBar(progresses);
      }

      const value = progress.getDataValue(property);
      if (!value) {
        return  property === 'bar' ? this.renderBar([progress]) : match;
      }
      // ||
      //  property === 'bar' ? this.renderBar([progress]) : match;

      const render = progress.getRender() ?? this;
      return render.params?.format[property] ? render.params.format[property](value) : value.toString();
    });
  }

  public renderBar(progresses: Progress[]): string {
    const { completeChar, resumeChar, width } = this.params.bar;
    const lines = [];

    const last = progresses
      .map((item, index) => ({
        size: Math.round(item.getProgress() * width),
        item,
        color: this.colors[index] ? this.colors[index] : (s: string) => s,
      }))
      .sort((a, b) => Math.sign(a.size - b.size))
      .reduce((prev, current) => {
        const length = current.size - prev.size;
        if (length > 0) {
          const defaultColor = (s: string) => s;
          const color = current.item.getRender()?.params?.bar?.color ?? current.color ?? defaultColor;
          lines.push(color(completeChar.repeat( length > width ? width : length )));
        }
        return current;
      }, { size: 0 });

    if (width - last.size > 0) {
      lines.push(resumeChar.repeat(width - last.size));
    }
    return lines.join('');
  }
}
