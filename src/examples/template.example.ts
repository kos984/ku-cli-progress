import { Bar, BarItem, Progress } from '../';
import { loopProgresses } from './helpers';

const bar = new Bar();
const progress = new Progress({ total: 100 }, { task: 'users creating...' });
function* Spinner(chars: string[], delay = 500): Generator<string> {
  let [index, char, lastUpdate] = [0, ' ', 0];
  while (true) {
    if (Date.now() - lastUpdate > delay) {
      index = index + 1 >= chars.length ? 0 : index + 1;
      char = chars.length ? chars[index] : '';
      lastUpdate = Date.now();
    }
    yield char;
  }
}
const spinner = Spinner(['\\', '|', '/', '-']);
bar.add(
  new BarItem(progress, {
    template:
      '[{bar}] {spinner} {percentage} ETA: {eta} speed: {speed} duration: {duration} {value}/{total} (task: {task})',
    dataProviders: {
      spinner: () => spinner.next().value,
    },
  }),
);
bar.add(
  new BarItem<never, { spinner: () => string }>(progress, {
    template: ({
      bar,
      percentage,
      eta,
      speed,
      duration,
      value,
      total,
      spinner,
    }) => {
      const task = progress.getPayload().task;
      return `[${bar}] ${spinner} ${percentage} ETA: ${eta} speed: ${speed} duration: ${duration} ${value}/${total} (task: ${task})`;
    },
    dataProviders: {
      spinner: () => spinner.next().value,
    },
  }),
);
progress.increment(1, { task: 'permission granting...' });

bar.start();
loopProgresses([progress], () => 50);
