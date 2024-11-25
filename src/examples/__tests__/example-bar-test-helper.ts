import spyOn = jest.spyOn;
import { Bar } from '../../lib/bar';
import { IProgress } from '../../lib/interfaces/progress.interface';
import { IEta } from '../../lib/interfaces/eta.interface';

export interface IExampleBarTestHelperParams {
  bar: Bar;
  maxSteps: number;
}

export class ExampleBarTestHelper {
  public bar!: Bar;
  public maxSteps!: number;
  public progresses!: IProgress[];
  public etas!: IEta[];
  public initialValues!: number[];
  public etaMockValue: number = 0;

  public constructor(params: IExampleBarTestHelperParams) {
    const { bar, maxSteps } = params;
    this.bar = bar;
    this.maxSteps = maxSteps;
    this.progresses = this.extractProgresses(bar);
    this.initialValues = this.progresses.map(progress => progress.getValue());
    this.etas = this.progresses.map(progress => progress.getEta());
    this.etas.forEach(eta => {
      spyOn(eta, 'getEtaS').mockImplementation(() => Infinity);
      spyOn(eta, 'getSpeed').mockImplementation(() => 0);
      spyOn(eta, 'getDurationMs').mockReturnValue(0);
    });
    bar.stop();
  }

  public beforeEach() {
    this.etaMockValue = 0;
    this.progresses.forEach((progress, index) =>
      progress.set(this.initialValues[index]),
    );
  }

  public iterate(nextValueF: (progress: IProgress, index: number) => number) {
    while (this.progresses.some(progress => progress.getProgress() < 1)) {
      this.nextStep(nextValueF);
    }
  }

  public nextStep(nextValueF: (progress: IProgress, index: number) => number) {
    this.etaMockValue++;
    const etaMockValue = this.etaMockValue;
    this.etas.forEach(eta => {
      spyOn(eta, 'getEtaS').mockImplementation(
        () => (this.maxSteps - etaMockValue) * 10,
      );
      spyOn(eta, 'getSpeed').mockImplementation(() => 10 + etaMockValue);
      spyOn(eta, 'getDurationMs').mockReturnValue(etaMockValue * 1000);
    });
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

// FIXME: arguments to object
// eslint-disable-next-line max-lines-per-function
/*
export const test = (bar: Bar, STEPS) => {
  const iterate = (
    nextValueF: (progress: IProgress, index: number) => number,
  ) => {
    while (progresses.some(progress => progress.getProgress() < 1)) {
      etaMockValue++;
      etas.forEach(eta => {
        spyOn(eta, 'getEtaS').mockImplementation(
          () => (STEPS - etaMockValue) * 10,
        );
        spyOn(eta, 'getSpeed').mockImplementation(() => 10 + etaMockValue);
        spyOn(eta, 'getDurationMs').mockReturnValue(etaMockValue * 1000);
      });
      progresses.forEach((progress, index) => {
        if (progress.getProgress() < 1) {
          const value = nextValueF(progress, index); // progress.getTotal() / STEPS;
          if (progress.getValue() + value > progress.getTotal()) {
            progress.increment(progress.getTotal() - progress.getValue());
          } else {
            progress.increment(value);
          }
        }
      });
      bar.render();
    }
  };
  return { etas, etaMockValue, beforeEach, iterate };
};
 */
