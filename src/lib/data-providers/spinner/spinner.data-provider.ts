import { IProgress } from '../../interfaces/progress.interface';
import { getTime } from '../../time';

export class SpinnerDataProvider {
  public static presets = {
    SLASH: ['\\', '|', '/', '-'],
    BRAILLE: ['⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏', '⠋', '⠙'],
  };

  public constructor(
    protected chars: string[],
    protected delay = 500,
  ) {}

  public getProviders(): {
    spinner: (progress: IProgress, progresses: IProgress[]) => string;
  } {
    let [index, char, lastUpdate] = [0, this.chars[0], 0];
    return {
      spinner: (progress: IProgress): string => {
        const time = getTime();
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
