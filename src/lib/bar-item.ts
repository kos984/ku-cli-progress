import { IBarOptions } from './interfaces/bar-options.interface';
import { IProgress } from './interfaces/progress.interface';
import { IBarItem } from './interfaces/bar-item.interface';
import { BarDataProvider } from './data-providers/bar/bar.data-provider';
import { BarDataResult } from './data-providers/bar/bar.data-result';
import { defaultTemplate } from './templates/default.template';
import { EtaDataProvider } from './data-providers/eta/eta.data-provider';

export type IBarFormatter = (
  str: BarDataResult,
  progress: IProgress,
  progresses: IProgress[],
) => BarDataResult | string;

export type IFormatter = (
  str: string,
  progress: IProgress,
  progresses: IProgress[],
) => string;

export interface IObjectFormatter<IFormatter> {
  formatter: IFormatter;
}

export interface IFormatters {
  bars: IBarFormatter | IObjectFormatter<IBarFormatter>;
  bar: IBarFormatter | IObjectFormatter<IBarFormatter>;
  etaHumanReadable: IFormatter | IObjectFormatter<IFormatter>;
}

export type IDataProvider<IResult> = (
  progress: IProgress,
  progresses: IProgress[],
) => IResult;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ITemplateFunction<ICustomDataProvider = any> = (
  ...args: (IDataProviders & ICustomDataProvider)[]
) => string;

export interface IDataProviders {
  bars: BarDataResult;
  bar: BarDataResult;
  speed: number;
  eta: number;
  etaHumanReadable: IDataProvider<string>;
  value: number;
  total: number;
  percentage: number;
  duration: number;
  progress: IProgress;
  progresses: IProgress[];
}

export interface IParams<ICustomInterfaces extends ICustomInterfacesExtends> {
  template?: ITemplateFunction<ICustomInterfaces['dataProviders']>;
  options?: Partial<IBarOptions>;
  formatters?: Partial<IFormatter & ICustomInterfaces['formatters']>;
  dataProviders?: Record<string, IDataProvider<unknown>>;
}

export interface ICustomInterfacesExtends {
  formatters?: unknown;
  dataProviders?: unknown;
}

export class BarItem<
  ICustomInterfaces extends Partial<ICustomInterfacesExtends>,
> implements IBarItem
{
  protected template!: ITemplateFunction<ICustomInterfaces['formatters']>;
  protected options: IBarOptions = {
    completeChar: '=',
    resumeChar: '-',
    width: 40,
    glue: '',
  };
  protected formatters!: Partial<IFormatters & ICustomInterfaces['formatters']>;
  protected dataProviders!: (IDataProviders &
    ICustomInterfaces['dataProviders'])[];
  protected progresses: IProgress[];

  public constructor(
    progresses: IProgress | IProgress[],
    params?: IParams<Partial<ICustomInterfaces>>,
  ) {
    this.progresses = Array.isArray(progresses) ? progresses : [progresses];
    this.template = params?.template ?? defaultTemplate;
    this.options = { ...this.options, ...params?.options };
    this.formatters = params?.formatters ?? ({} as Partial<IFormatter>);
    this.dataProviders = this.progresses.map(progress =>
      this.getDataProviders(progress, params?.dataProviders),
    );
  }

  public getProgresses(): IProgress[] {
    return this.progresses;
  }

  public render(): string {
    return this.template(...this.dataProviders);
  }

  // eslint-disable-next-line max-lines-per-function
  protected getDataProviders(
    progress: IProgress,
    customDataProviders?: Record<
      string,
      (progress: IProgress, progresses: IProgress[]) => unknown
    >,
  ): IDataProviders & ICustomInterfaces['dataProviders'] {
    const progresses = this.progresses;
    const formatters = this.formatters;
    const barDataProvider = new BarDataProvider(this.options).getProviders();
    const etaDataProvider = new EtaDataProvider().getProviders();

    const dataProviders = {
      get value() {
        return progress.getValue();
      },
      get total() {
        return progress.getTotal();
      },
      get percentage() {
        return Math.round(progress.getProgress() * 100);
      },
      get eta() {
        return progress.getEta().getEtaS();
      },
      get speed() {
        return Math.round(progress.getEta().getSpeed());
      },
      get duration() {
        return Math.round(progress.getEta().getDurationMs() / 1000);
      },
      get progress() {
        return progress;
      },
      get progresses() {
        return progresses;
      },
    };

    // etaDataProvider
    for (const dataProvider of [
      barDataProvider,
      etaDataProvider,
      customDataProviders,
    ].filter(Boolean)) {
      Object.keys(dataProvider).forEach(key => {
        Object.defineProperty(dataProviders, key, {
          get() {
            const result = dataProvider[key](progress, progresses);
            if (formatters[key]) {
              return formatters[key]?.formatter
                ? formatters[key].formatter(result, progress, progresses)
                : formatters[key](result, progress, progresses);
            }
            return result;
          },
          enumerable: true,
          configurable: false,
        });
      });
    }

    return dataProviders as unknown as IDataProviders &
      ICustomInterfaces['dataProviders'];
  }
}
