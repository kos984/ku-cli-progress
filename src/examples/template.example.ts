import { Bar, BarItem, Progress } from '../';

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
progress.increment(1, { task: 'permission granting...' });

const interval = setInterval(() => {
  if (progress.getProgress() >= 1) {
    clearInterval(interval);
  }
  progress.increment();
}, 50);
bar.start();
