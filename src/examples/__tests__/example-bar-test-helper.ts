jest.mock('../../lib/time/time');

import { Bar } from '../../lib/bar';
import { IProgress } from '../../lib/interfaces/progress.interface';
import { Time } from '../../lib/time/time';

export interface IExampleBarTestHelperParams {
  bar: Bar;
  maxSteps: number;
  stopBarOnStart?: boolean;
}

export class ExampleBarTestHelper {
  public bar!: Bar;
  public maxSteps!: number;
  public progresses!: IProgress[];
  public initialValues!: number[];
  public time = new Time() as jest.Mocked<Time>;
  // public timeMock!: jest.Mock;

  public constructor(params: IExampleBarTestHelperParams) {
    const { bar, maxSteps } = params;
    this.bar = bar;
    this.maxSteps = maxSteps;
    // this.timeMock = getTime as jest.Mock;
    this.progresses = this.extractProgresses(bar);
    this.initialValues = this.progresses.map(progress => progress.getValue());
    if (params.stopBarOnStart || params.stopBarOnStart === undefined) {
      bar.stop();
    }
  }

  public setMockReturnValue(value: number) {
    const TimeMock = Time as never as { instances: jest.Mocked<Time>[] };
    for (const instance of TimeMock.instances) {
      instance.getTime.mockReturnValue(value);
    }
  }

  public beforeEach() {
    this.time.getTime.mockReturnValue(0);
    this.setMockReturnValue(0);
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
      this.setMockReturnValue(step * 1000);
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
