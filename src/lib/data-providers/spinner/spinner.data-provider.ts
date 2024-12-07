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

  public constructor(params?: ISpinnerDataProviderParams) {
    this.chars = params?.chars || SpinnerDataProvider.presets.SLASH.chars;
    this.delay = params?.delay || 500;
    this.time = params?.time || this.time;
  }

  public getProviders(): {
    spinner: (progress: IProgress, progresses: IProgress[]) => string;
  } {
    let [index, char, lastUpdate] = [0, this.chars[0], 0];
    return {
      spinner: (progress: IProgress): string => {
        const time = this.time.getTime();
        if (progress.getProgress() < 1 && time - lastUpdate > this.delay) {
          index = index + 1 >= this.chars.length ? 0 : index + 1;
          char = this.chars[index];
          lastUpdate = time;
        }
        return char;
      },
    };
  }
}
