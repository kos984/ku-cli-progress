import { IProgress } from '../../interfaces/progress.interface';
import { Time } from '../../time/time';

export interface ISpinnerDataProviderParams {
  chars?: string[];
  delay?: number;
  time?: Time;
}

export class SpinnerDataProvider {
  public static presets = {
    SLASH: {
      chars: ['\\', '|', '/', '-'],
    },
    BRAILLE: {
      chars: ['⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏', '⠋', '⠙'],
    },
  };

  protected time!: Time;
  protected chars: string[];
  protected delay: number;

  protected index: number = 0;
  protected lastUpdate: number = 0;

  public constructor(params?: ISpinnerDataProviderParams) {
    this.chars = params?.chars || SpinnerDataProvider.presets.SLASH.chars;
    this.delay = params?.delay || 500;
    this.time = params?.time || new Time();
  }

  public getProviders(): {
    spinner: (progress: IProgress, progresses: IProgress[]) => string;
  } {
    return {
      spinner: this.getData.bind(this),
    };
  }

  public getData(progress: IProgress): string {
    let index = this.index;
    const time = this.time.getTime();
    if (progress.getProgress() < 1 && time - this.lastUpdate > this.delay) {
      index = index + 1 >= this.chars.length ? 0 : index + 1;
      this.index = index;
      this.lastUpdate = time;
    }
    return this.chars[index];
  }
}
