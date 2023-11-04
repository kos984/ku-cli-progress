import { IBarOptions } from './interfaces/bar-options.interface';
import { IProgress } from './interfaces/progress.interface';
import { IBarItem } from './interfaces/bar-item.interface';
import { BarDataProvider } from './data-providers/bar/bar.data-provider';
import { BarDataResult } from './data-providers/bar/bar.data-result';
import * as fs from 'fs';
import * as path from 'path';

export interface IBarFormatter {
  (
    str: BarDataResult,
    progress: IProgress,
    progresses: IProgress[],
  ): BarDataResult | string;
}

export interface IFormatter {
  (str: string, progress: IProgress, progresses: IProgress[]): string;
}

export interface IObjectFormatter<IFormatter> {
  formatter: IFormatter;
}

export interface IFormatters {
  bars: IBarFormatter | IObjectFormatter<IBarFormatter>;
  bar: IBarFormatter | IObjectFormatter<IBarFormatter>;
  speed: IFormatter | IObjectFormatter<IFormatter>;
  eta: IFormatter | IObjectFormatter<IFormatter>;
  etaHumanReadable: IFormatter | IObjectFormatter<IFormatter>;
  value: IFormatter | IObjectFormatter<IFormatter>;
  total: IFormatter | IObjectFormatter<IFormatter>;
  percentage: IFormatter | IObjectFormatter<IFormatter>;
  duration: IFormatter | IObjectFormatter<IFormatter>;
}

export interface IDataProvider<IResult> {
  (progress: IProgress, progresses: IProgress[]): IResult;
}

export interface IDataProviders {
  // [key: string]: (progress: IProgress, progresses: IProgress[]) => string;
  bars: IDataProvider<BarDataResult>;
  bar: IDataProvider<BarDataResult>;
  speed: IDataProvider<string>;
  eta: IDataProvider<string>;
  etaHumanReadable: IDataProvider<string>;
  value: IDataProvider<string>;
  total: IDataProvider<string>;
  percentage: IDataProvider<string>;
  duration: IDataProvider<string>;
}

export interface IParams<ICustomFormatters, ICustomDataProvider> {
  tagDelimiter?: string;
  template?: ITemplate<ICustomDataProvider>;
  options?: Partial<IBarOptions>;
  formatters?: Partial<IFormatters & ICustomFormatters>;
  dataProviders?: Partial<IDataProviders & ICustomDataProvider>;
}

type IData<T> = {
  [K in keyof T]: string;
} & {
  [K in keyof IDataProviders]: string;
};

export interface IFunctionTemplate<ICustomDataProvider> {
  (dataProviders: IData<ICustomDataProvider>): string;
}
export type ITemplate<ICustomDataProvider> =
  | string
  | IFunctionTemplate<ICustomDataProvider>;

export class BarItem<ICustomFormatters = any, ICustomDataProvider = any>
  implements IBarItem
{
  protected template!: ITemplate<ICustomDataProvider>;
  protected tagDelimiter!: string;
  protected options: IBarOptions = {
    completeChar: '=',
    resumeChar: '-',
    width: 40,
    glue: '',
  };
  protected formatters!: Partial<IFormatters & ICustomFormatters>;
  protected dataProviders!: IDataProviders & ICustomDataProvider;
  protected progresses: IProgress[];

  public constructor(
    progresses: IProgress | IProgress[],
    params?: IParams<ICustomFormatters, ICustomDataProvider>,
  ) {
    this.progresses = Array.isArray(progresses) ? progresses : [progresses];
    this.tagDelimiter = params?.tagDelimiter ?? '_';
    this.template =
      params?.template ?? this.getDefaultTemplate(this.progresses);
    this.options = { ...this.options, ...params?.options };
    this.formatters = params?.formatters ?? ({} as never);
    this.dataProviders = this.getDataProviders(params?.dataProviders);
  }

  public getProgresses(): IProgress[] {
    return this.progresses;
  }

  public render(): string {
    const next = this.getCounterByProperty(this.progresses.length);
    if (typeof this.template !== 'string') {
      const handler = this.proxyHandler;
      // FIXME: it should be on top
      const data = new Proxy(
        {},
        {
          get(target, prop) {
            return handler(prop as string, next);
          },
        },
      );
      return this.template(data as IData<ICustomDataProvider>);
    }
    return this.template.replace(/{([^{}]+)}/g, (match, prop) => {
      const [property, tag] = prop.split(this.tagDelimiter).reverse();
      const index = tag
        ? this.progresses.findIndex(p => p.getTag() === tag)
        : next(property);
      if (index < 0) return match;
      return this.getValue(property, index);
    });
  }

  protected proxyHandler = (property: string, next) => {
    if (!(property in this.dataProviders)) {
      throw new Error(`unknown data provider: ${property}`);
    }
    const getValue = this.getValue;
    const progresses = this.progresses; // FIXME: think about it
    return new Proxy(
      { key: property },
      {
        get(target, prop) {
          if (typeof ''[prop] === 'function') {
            return () => getValue(property, next(target.key))[prop]();
          }
          let index = Number.parseInt(prop.toString() as string, 10);
          index = Number.isFinite(index)
            ? index
            : progresses.findIndex(p => p.getTag() === prop);
          return index < 0 ? target[prop] : getValue(property, index);
        },
      },
    );
  };

  protected getCounterByProperty(max) {
    const map = new Map();
    return key => {
      let index = map.get(key) ?? 0;
      if (index >= max) {
        index = 0;
      }
      map.set(key, index + 1);
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

  protected getValue = (prop: string, index: number): string => {
    if (index < 0 || index > this.progresses.length) return prop;
    const progress = this.progresses[index];
    const value = this.getDataValue(prop, progress);
    const formatter = this.formatters[prop];
    if (formatter) {
      return (formatter?.formatter || formatter)(
        value,
        progress,
        this.progresses,
      );
    }
    return value;
  };

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
  protected getDataProviders(
    dataProviders?: Partial<IDataProviders>,
  ): IDataProviders & ICustomDataProvider {
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
      ...new BarDataProvider(this.options).getProviders(),
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
    } as IDataProviders & ICustomDataProvider;
  }
}
