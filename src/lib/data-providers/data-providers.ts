import { IProgress } from '../interfaces/progress.interface';

export class DataProviders {
  protected _progress!: IProgress;
  protected _progresses!: IProgress[];

  public constructor(params: {
    progress: IProgress;
    progresses: IProgress[];
    customDataProviders?: Record<
      string,
      (progress: IProgress, progresses: IProgress[]) => unknown
    >[];
  }) {
    this._progress = params.progress;
    this._progresses = params.progresses;

    const dataProviders = (params.customDataProviders || []).filter(Boolean);
    for (const dataProvider of dataProviders) {
      Object.keys(dataProvider).forEach(key => {
        Object.defineProperty(this, key, {
          get() {
            return dataProvider[key](params.progress, params.progresses);
          },
          enumerable: true,
          configurable: false,
        });
      });
    }
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
