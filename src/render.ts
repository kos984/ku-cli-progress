import { Progress } from './progress';
import { IRender } from './types';

export interface IBarParams {
  completeChar: string;
  resumeChar: string;
  width: number;
  glue: string;
}

export interface IRenderParams {
  template: string;
  bar: Partial<IBarParams>
  format: {
    [key: string]: (str: string, progress: Progress[]) => string
  }
}

export class Render implements IRender {

  public static readonly preset = {
    shades: { bar: { completeChar: '\u2588', resumeChar: '\u2591' } },
    classic: { bar: { completeChar: '=', resumeChar: '-' } },
    rect: { bar: { completeChar: '\u25A0', resumeChar: ' ' } },
  }

  protected static assignParams(...params: Array<Partial<IRenderParams>>): IRenderParams & { bar: IBarParams } {
    const defaultParams = {
      template: `[{bar}] {percentage} ETA: {eta} speed: {speed} duration: {duration} {value}/{total}`,
      bar: {
        completeChar: '=',
        resumeChar: '-',
        width: 40,
        glue: '',
      },
      format: {
        bar: (srt: string) => srt,
        eta: (str: string) => str,
        value: (str: string) => str,
        total: (str: string) => str,
      },
    };
    const assignWithDefaults = (defaults: IRenderParams, params: Partial<IRenderParams>) => ({
      ...defaults,
      ...params,
      bar: { ...defaults.bar, ...params.bar },
      format: { ...defaults.format, ...params.format },
    });

    return !params.length
      ? defaultParams
      : <IRenderParams & { bar: IBarParams }>params.reduce(assignWithDefaults, defaultParams);
  }

  protected params: IRenderParams & { bar: IBarParams };

  public constructor(params: Partial<IRenderParams> = {}) {
    this.params = Render.assignParams(params);
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

      const render = progress.getRender() ?? this;
      const formatFunction = render.params.format[property];
      if (property === 'bars' && progresses.length > 1) {
        // do not allow format bars, just return
        return formatFunction ? formatFunction(this.renderBars(progresses), progresses) : this.renderBars(progresses);
      }
      const value = progress.getDataValue(property);
      if (property === 'bar') {
        return value ?? render.renderBar({ progress });
      }
      if (!value) {
        return match;
      }
      return formatFunction ? formatFunction(value, progresses) : value.toString();
    });
  }

  public renderBar(params: { progress: Progress, renderResume?: boolean, size?: number }): string {
    const { completeChar, resumeChar, width, glue } = this.params.bar;
    const { renderResume, size } = {
      renderResume: true,
      size: params.size ?? Math.round(params.progress.getProgress() * width),
      ...params,
    }
    const lines = [];
    lines.push(completeChar.repeat(size));
    if (renderResume) {
      lines.push(resumeChar.repeat(width - size));
    }
    const color = this.params.format.bar;
    return color(lines.join(glue), [params.progress]);
  }

  public renderBars(progresses: Progress[]): string {
    const { resumeChar, width, glue } = this.params.bar;
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
          const render = current.item.getRender() ?? this;
          lines.push(render.renderBar({
            progress: current.item,
            renderResume: false,
            size: length > width ? width : length,
          }))
        }
        return current;
      }, { size: 0 });

    if (width - leftLength.size > 0) {
      lines.push(resumeChar.repeat(width - leftLength.size));
    }
    return lines.join(glue);
  }
}
