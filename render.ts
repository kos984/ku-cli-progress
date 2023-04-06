import { Progress } from './progress';
// @ts-ignore
import chalk from 'chalk';

export interface IRenderParams {
  template: string;
  bar: Partial<{
    completeChar: string;
    resumeChar: string;
    color: (str: string) => string
    width: number;
  }>
  format: {
    [key: string]: (process: Progress) => string
  }
}

export class Render {
  protected params: IRenderParams;
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
        // TODO: think about this
        bar: (progress: Progress) => this.renderBar([progress]),
        eta: (progress: Progress) => '???',
        value: (progress: Progress) => progress.getValue().toString(),
        total: (progress: Progress) => progress.getTotal().toString(),
        ...params.format,
      },
    }
  }

  public render(progresses: Progress[]): string {
    if (progresses.length < 1) {
      return '';
    }
    return this.params.template.replace(/{([^}]+)}/g, (match, p) => {
      const [property, tag] = p.split('_').reverse();
      const progress = tag ? progresses.find(p => p.getTag() === tag) : progresses[0];
      if (!progress) {
        throw new Error('progress not found')
      }
      if (property === 'bars' && progresses.length > 1) {
        return this.renderBar(progresses);
      }
      const defaultF = (p: Progress) => match;
      return (progress.getRender()?.params?.format[property] ?? this.params.format[property] ?? defaultF)(progress);
    });
  }

  protected renderBar(progresses: Progress[]): string {
    // FIXME: fix params
    const doneChar = '=';
    const progressChar = '-';
    const barSize = 40;

    const lines = [];
    const last = progresses
      .map((item, index) => ({
        size: Math.round(item.getProgress() * barSize),
        item,
        color: this.colors[index] ? this.colors[index] : (s: string) => s,
      }))
      .sort((a, b) => Math.sign(a.size - b.size))
      .reduce((prev, current) => {
        const length = current.size - prev.size;
        if (length > 0) {
          const defaultColor = (s: string) => s;
          const color = current.item.getRender()?.params?.bar?.color ?? current.color ?? defaultColor;
          lines.push(color(doneChar.repeat( length > barSize ? barSize : length )));
        }
        return current;
      }, { size: 0 });

    if (barSize - last.size > 0) {
      lines.push(progressChar.repeat(barSize - last.size));
    }
    return lines.join('');
  }
}
