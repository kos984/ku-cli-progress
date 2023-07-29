import { BarsContainer } from '../bars-container';
import { Progress } from '../progress';
import { Bar } from '../bar';
// @ts-ignore
import * as chalk from 'chalk';
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

// just fan

const textInBarProgress = new Progress({ total: 200, start: 0 });
barsContainer.add(new Bar([textInBarProgress], {
  options: rect,
  formatters: {
    bar: (str, index, progresses) => {
      const progress = progresses[index];
      const percentage = ' ' + (Math.round(progress.getProgress() * 10000) / 100).toFixed(2) + '% ';
      const done = Math.round(progress.getProgress() * str.length);
      const startPosition = Math.round(str.length / 2 - percentage.length / 2);
      const out = str.substr(0, startPosition)
        + percentage
        + str.substr(startPosition + percentage.length);
      return chalk.yellowBright(out.substr(0, done)) + out.substr(done);
    }
  }
}));

const textInBarRotation = new Progress({ total: 100, start: 0 });

function * rotate(values: any[], timeoutMs: number) {
  let last = 0;
  let index = 0;
  let next = true;
  while (true) {
    const now = Date.now();
    if (next && now - last > timeoutMs) {
      index = ++index % values.length;
      last = now;
    }
    next = yield values[index];
  }
}

const spin = rotate(['\\', '|', '/', '-'], 150);

barsContainer.add(new Bar([textInBarProgress], {
  template: '[{bar}] {percentage} ETA: {eta} speed: {speed} duration: {duration} {value}/{total}',
  options: rect,
  formatters: {
    bar: str => chalk.yellowBright(str),
    percentage: (str, index, progresses) => spin.next(progresses[index].getProgress() < 1).value + ' ' + str,
  }
}));

barsContainer.add(new Bar([textInBarProgress], {
  template: '[{bar}] {percentage} ETA: {eta} speed: {speed} duration: {duration} {value}/{total}',
  options: {
    glue: '>>>>',
    width: 36,
    resumeChar: ' ',
    completeChar: ' ',
  },
  formatters: {
    bar: str => chalk.yellowBright(str),
    percentage: (str, index, progresses) => spin.next(progresses[index].getProgress() < 1).value + ' ' + str,
  }
}));

barsContainer.add(new Bar([textInBarProgress], {
  template: '[{bar}] {percentage} ETA: {eta} speed: {speed} duration: {duration} {value}/{total}',
  options: {
    glue: '|',
    width: 40,
    resumeChar: ' ',
    completeChar: ' ',
  },
  formatters: {
    bar: (str, index, progresses) => {
      const percent = (progresses[index].getProgress() * 100).toFixed(2) + '% >>>';
      const [start, end] = str.split('|');
      const text = percent.length < start.length
        ? start.substr(0, start.length - percent.length) + percent
        // : percent.substr(-start.length);
       : percent.substr(percent.length - start.length);
      return chalk.yellowBright(text + end);
    },
  }
}));

barsContainer.add(new Bar([textInBarProgress], {
  template: '[{bar}] {percentage} ETA: {eta} speed: {speed} duration: {duration} {value}/{total}',
  options: {
    glue: '|',
    width: 40,
    resumeChar: ' ',
    completeChar: ' ',
  },
  formatters: {
    bar: (str, index, progresses) => {
      const percent = '<<< ' + (progresses[index].getProgress() * 100).toFixed(2) + '%';
      const [end, start] = str.split('|');
      const text = end.length > percent.length
        ? percent + end.substr(0, end.length - percent.length)
        : percent.substr(0, end.length);
      return chalk.greenBright(start + text);
    },
  }
}));

barsContainer.add(new Bar([textInBarProgress], {
  template: '[{bar}] {percentage} ETA: {eta} speed: {speed} duration: {duration} {value}/{total}',
  options: shades,
  formatters: {
    bar: (str, index, progresses) => {
      return chalk.blueBright(str);
    },
  }
}));

barsContainer.add(new Bar([textInBarProgress], {
  template: '[{bar}] {percentage} ETA: {eta} speed: {speed} duration: {duration} {value}/{total}',
  options: { ...shades, glue: '|' },
  formatters: {
    bar: (str, index, progresses) => {
      const [start, end] = str.split('|');
      return chalk.blueBright(start) + chalk.redBright(end);
    },
  }
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
  if (textInBarProgress.getProgress() < 1) {
    textInBarProgress.increment(1);
    update = true;
  }
  if (textInBarRotation.getProgress() < 1) {
    textInBarRotation.increment(1);
    update = true;
  }
  if (update === false) {
    clearInterval(interval);
  }
  barsContainer.log('this is a test: ' + textInBarRotation.getProgress());

}, 1000);
