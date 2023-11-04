import { IProgress } from '../../interfaces/progress.interface';

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
    let [index, char, lastUpdate] = [0, (this.chars || [''])[0], 0];
    return {
      spinner: (progress: IProgress): string => {
        if (
          progress.getProgress() < 1 &&
          Date.now() - lastUpdate > this.delay
        ) {
          index = index + 1 >= this.chars.length ? 0 : index + 1;
          char = this.chars.length ? this.chars[index] : '';
          lastUpdate = Date.now();
        }
        return char;
      },
    };
  }
}
