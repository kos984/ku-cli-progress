import { IProgress } from '../interfaces/progress.interface';
import { IDataProvider } from '../bar-items/bar-item';

export class DataProviders {
  protected _progress!: IProgress;
  protected _progresses!: IProgress[];

  public static build(params: {
    progress: IProgress;
    progresses: IProgress[];
    customDataProviders?: Record<
      string,
      | IDataProvider<unknown, unknown>
      | { getData: IDataProvider<unknown, unknown> }
    >[];
  }) {
    const dataProviders = new DataProviders(params);
    DataProviders.defineProperties(dataProviders, params.customDataProviders);
    return dataProviders;
  }

  protected static defineProperties(
    obj: DataProviders,
    customDataProviders: Record<
      string,
      | IDataProvider<unknown, unknown>
      | { getData: IDataProvider<unknown, unknown> }
    >[],
  ) {
    const dataProviders = (customDataProviders || []).filter(Boolean);
    for (const dataProvider of dataProviders) {
      Object.keys(dataProvider).forEach(key => {
        if (!DataProviders.isAllowedKey(obj, key)) {
          return;
        }
        Object.defineProperty(obj, key, {
          get() {
            const provider = DataProviders.getProvider(dataProvider[key]);
            return provider(obj.progress, obj.progresses);
          },
          enumerable: true,
          configurable: false,
        });
      });
    }
  }

  protected static getProvider(
    provider:
      | IDataProvider<unknown, unknown>
      | { getData: IDataProvider<unknown, unknown> },
  ): IDataProvider<unknown, unknown> {
    if (
      typeof (provider as { getData: IDataProvider<unknown, unknown> })
        .getData === 'function'
    ) {
      return (
        provider as { getData: IDataProvider<unknown, unknown> }
      ).getData.bind(provider);
    }
    return provider as IDataProvider<unknown, unknown>;
  }

  protected static isAllowedKey(obj: unknown, key: string): boolean {
    return !(key in (obj as Record<string, unknown>));
  }

  protected constructor(params: {
    progress: IProgress;
    progresses: IProgress[];
  }) {
    this._progress = params.progress;
    this._progresses = params.progresses;
  }

  get value() {
    return this._progress.getValue();
  }

  get total() {
    return this._progress.getTotal();
  }

  get percentage() {
    return Math.round(this._progress.getProgress() * 100);
  }

  get eta() {
    return this._progress.getEta().getEtaS();
  }

  get speed() {
    return Math.round(this._progress.getEta().getSpeed());
  }

  get duration() {
    return Math.round(this._progress.getEta().getDurationMs() / 1000);
  }

  get progress() {
    return this._progress;
  }

  get progresses() {
    return this._progresses;
  }
}
