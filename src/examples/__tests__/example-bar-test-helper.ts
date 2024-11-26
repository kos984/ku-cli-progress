import { Bar } from '../../lib/bar';
import { IProgress } from '../../lib/interfaces/progress.interface';
import { getTime } from '../../lib/time/time';

export interface IExampleBarTestHelperParams {
  bar: Bar;
  maxSteps: number;
}

export class ExampleBarTestHelper {
  public bar!: Bar;
  public maxSteps!: number;
  public progresses!: IProgress[];
  public initialValues!: number[];
  public timeMock!: jest.Mock;

  public constructor(params: IExampleBarTestHelperParams) {
    const { bar, maxSteps } = params;
    this.bar = bar;
    this.maxSteps = maxSteps;
    this.timeMock = getTime as jest.Mock;
    this.progresses = this.extractProgresses(bar);
    this.initialValues = this.progresses.map(progress => progress.getValue());
    bar.stop();
  }

  public beforeEach() {
    this.timeMock.mockReturnValue(0);
    this.progresses.forEach((progress, index) =>
      progress.set(this.initialValues[index]),
    );
  }

  public iterate(nextValueF: (progress: IProgress, index: number) => number) {
    let step = 0;
    while (
      this.progresses.some(progress => progress.getProgress() < 1) &&
      step < this.maxSteps
    ) {
      this.timeMock.mockReturnValue(step * 1000);
      this.nextStep(nextValueF);
      step++;
    }
  }

  public nextStep(nextValueF: (progress: IProgress, index: number) => number) {
    this.progresses.forEach((progress, index) => {
      if (progress.getProgress() < 1) {
        const value = nextValueF(progress, index); // progress.getTotal() / STEPS;
        if (progress.getValue() + value > progress.getTotal()) {
          progress.increment(progress.getTotal() - progress.getValue());
        } else {
          progress.increment(value);
        }
      }
    });
    this.bar.render();
  }

  protected extractProgresses(bar: Bar) {
    const progresses = [];
    bar.getItems().forEach(item => {
      progresses.push(...item.getProgresses());
    });
    return progresses;
  }
}
