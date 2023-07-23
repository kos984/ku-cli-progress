import { BarsContainer } from '../bars-container';
import { Progress } from '../progress';
import { Bar } from '../bar';
// @ts-ignore
import chalk from 'chalk';
import { rect, shades } from '../presets';

const barsContainer = new BarsContainer();
const p = new Progress({ total: 100 });

// create simple bar
barsContainer.add(new Bar([p]));

// add multi color bar with tags
barsContainer.add(new Bar([p, new Progress({ total: 100, start: 50, tag: 'red' }), p], {
  // override default template
  template: `[{bars}] {percentage} ETA: {eta} speed: {speed} duration: {duration} {red_value} {value}/{total}`,
  formatters: {
    'red_bar': str => chalk.red(str),
    'bar': str => chalk.green(str),
  }
}));

// add multi color bar
barsContainer.add(new Bar([
    new Progress({ total: 100, start: 50, tag: 'green' }),
    new Progress({ total: 100, start: 65, tag: 'red' }),
    new Progress({ total: 100, start: 78, tag: 'blue' }),
    new Progress({ total: 100, start: 90, tag: 'yellow' }),
  ], {
  template: `[{bars}] {percentage} ETA: {eta} speed: {speed} duration: {duration} {value}/{total}`,
  formatters: {
    'bar': (str, index) => {
      const colors = [chalk.green, chalk.red, chalk.blue, chalk.yellow];
      return colors[index](str);
    },
  }
}));

// custom payload
const progressWithCustomPayload = new Progress({ total: 100, start: 75 }, {
  user: 'John Doe',
})

barsContainer.add(new Bar([progressWithCustomPayload], {
  template: `[{bar}] {percentage} custom: {custom}`,
  formatters: {
    // format custom payload
    user: str => chalk.bold(str),
  }
}))

// use presets
barsContainer.add(new Bar([new Progress({ total: 100, start: 33 })], {
  options: rect
}));

barsContainer.add(new Bar([new Progress({ total: 100, start: 77 })], {
  options: shades
}));

barsContainer.start();

const interval = setInterval(() => {
  let update = false;
  if (progressWithCustomPayload.getProgress() < 1) {
    progressWithCustomPayload.increment(1);
    update = true;
  }
  if (p.getProgress() < 1) {
    p.increment(1);
    update = true;
  }
  if (update === false) {
    clearInterval(interval);
  }

}, 500);
