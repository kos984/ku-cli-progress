import { Bar, BarItemLegacy, presets, Progress } from '../../index';
import { loopProgresses } from './helpers';

const bar = new Bar();
const progresses = [1e2, 1e3, 1e4, 1e5, 1e6, 1e7].map(
  total => new Progress({ total }),
);

const template = `[{bar}] {percentage} ETA: {etaHumanReadable} speed: {speed} duration: {duration} {value}/{total}`;

progresses.forEach(progress => {
  bar.add(
    new BarItemLegacy(progress, {
      template,
      options: presets.braille,
    }),
  );
});

bar.start();

loopProgresses(progresses);
