import spyOn = jest.spyOn;
import { Bar } from '../../lib/bar';
import { IProgress } from '../../lib/interfaces/progress.interface';

const extractProgresses = (bar: Bar) => {
  const progresses = [];
  bar.getItems().forEach(item => {
    progresses.push(...item.getProgresses());
  });
  return progresses;
};

// FIXME: arguments to object
// eslint-disable-next-line max-lines-per-function
export const test = (bar: Bar, STEPS) => {
  const progresses = extractProgresses(bar);
  const initialValues = progresses.map(progress => progress.getValue());

  const beforeEach = () => {
    etaMockValue = 0;
    progresses.forEach((progress, index) => progress.set(initialValues[index]));
  };

  const etas = progresses.map(progress => progress.getEta());
  let etaMockValue = 0;
  etas.forEach(eta => {
    spyOn(eta, 'getEtaS').mockImplementation(() => Infinity);
    spyOn(eta, 'getSpeed').mockImplementation(() => 0);
    spyOn(eta, 'getDurationMs').mockReturnValue(0);
  });
  bar.stop();
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
