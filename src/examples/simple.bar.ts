import { Bar } from '../lib/bar';
import { Progress } from '../lib/progress';
import { BarItem } from '../lib/bar-item';
import * as chalk from 'chalk';
import { presets } from '../lib/presets';

const bar = new Bar();
const p = new Progress({ total: 100 });

// create simple bar
bar.add(new BarItem([p]));

// add multi color bar with tags
bar.add(new BarItem([p, new Progress({ total: 100, start: 50, tag: 'red' }), p], {
  // override default template
  template: `[{bars}] {percentage} ETA: {eta} speed: {speed} duration: {duration} {red_value} {value}/{total}`,
  formatters: {
    'red_bar': str => chalk.red(str),
    'bar': str => chalk.green(str),
  }
}));

// add multi color bar
bar.add(new BarItem([
    new Progress({ total: 100, start: 50, tag: 'green' }),
    new Progress({ total: 100, start: 65, tag: 'red' }),
    new Progress({ total: 100, start: 78, tag: 'blue' }),
    new Progress({ total: 100, start: 90, tag: 'yellow' }),
  ], {
  template: `[{bars}] {percentage} ETA: {eta} speed: {speed} duration: {duration} {value}/{total}`,
  options: presets.shades,
  formatters: {
    'bar': (str, progress, progresses) => {
      const index = progresses.findIndex(p => p === progress);
      const colors = [chalk.green, chalk.red, chalk.blue, chalk.yellow];
      return colors[index](str);
    },
  }
}));

// custom payload
const progressWithCustomPayload = new Progress({ total: 100, start: 75 }, {
  user: 'John Doe',
})

bar.add(new BarItem([progressWithCustomPayload], {
  template: `[{bar}] {percentage} custom: {custom}`,
  formatters: {
    // format custom payload
    user: str => chalk.bold(str),
  }
}))

// use presets
bar.add(new BarItem([new Progress({ total: 100, start: 33 })], {
  options: presets.rect
}));

bar.add(new BarItem([new Progress({ total: 100, start: 77 })], {
  options: presets.shades
}));

// just fan

const textInBarProgress = new Progress({ total: 200, start: 0 });
bar.add(new BarItem([textInBarProgress], {
  options: presets.rect,
  formatters: {
    bar: (str, progress) => {
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

function * rotate(values: any[], minTimeoutMs: number): Generator<string, string, boolean> {
  let last = 0;
  let index = 0;
  let next: boolean = true;
  while (true) {
    const now = Date.now();
    if (next && now - last > minTimeoutMs) {
      index = ++index % values.length;
      last = now;
    }
    next = yield values[index];
  }
}

const spin = rotate(['\\', '|', '/', '-'], 150);

bar.add(new BarItem([textInBarProgress], {
  template: '[{bar}] {percentage} ETA: {eta} speed: {speed} duration: {duration} {value}/{total}',
  options: presets.rect,
  formatters: {
    bar: str => chalk.yellowBright(str),
    percentage: (str, progress) => spin.next(progress.getProgress() < 1).value + ' ' + str,
  }
}));

bar.add(new BarItem([textInBarProgress], {
  template: ' {percentage} {spin} ETA: {eta} speed: {speed} duration: {duration} {value}/{total}\n[{bar}][{spin}] {percentage} ETA: {eta} speed: {speed} duration: {duration} {value}/{total}',
  options: {
    glue: '>>>>',
    width: 36,
    resumeChar: ' ',
    completeChar: ' ',
  },
  formatters: {
    bar: str => chalk.yellowBright(str),
  },
  dataProviders: {
    spin: (progress) => spin.next(progress.getProgress() < 1).value,
    longText: () => 'this is a long text with multi lines\nline 2 with some text', // FIXME: is it need ?
  },
}));

bar.add(new BarItem([textInBarProgress], {
  template: '[{bar}] {percentage} ETA: {eta} speed: {speed} duration: {duration} {value}/{total}',
  options: {
    glue: '|',
    width: 40,
    resumeChar: ' ',
    completeChar: ' ',
  },
  formatters: {
    bar: (str, progress) => {
      const percent = (progress.getProgress() * 100).toFixed(2) + '% >>>';
      const [start, end] = str.split('|');
      const text = percent.length < start.length
        ? start.substr(0, start.length - percent.length) + percent
        // : percent.substr(-start.length);
       : percent.substr(percent.length - start.length);
      return chalk.yellowBright(text + end);
    },
  }
}));

bar.add(new BarItem([textInBarProgress], {
  template: '[{bar}] {percentage} ETA: {eta} speed: {speed} duration: {duration} {value}/{total}',
  options: {
    glue: '|',
    width: 40,
    resumeChar: ' ',
    completeChar: ' ',
  },
  formatters: {
    bar: (str, progress) => {
      const percent = '<<< ' + (progress.getProgress() * 100).toFixed(2) + '%';
      const [end, start] = str.split('|');
      const text = end.length > percent.length
        ? percent + end.substr(0, end.length - percent.length)
        : percent.substr(0, end.length);
      return chalk.greenBright(start + text);
    },
  }
}));

bar.add(new BarItem([textInBarProgress], {
  template: '[{bar}] {percentage} ETA: {eta} speed: {speed} duration: {duration} {value}/{total}',
  options: presets.shades,
  formatters: {
    bar: (str) => {
      return chalk.blueBright(str);
    },
  }
}));

bar.add(new BarItem([textInBarProgress], {
  template: '[{bar}] {percentage} ETA: {eta} speed: {speed} duration: {duration} {value}/{total}',
  options: { ...presets.shades, glue: '|' },
  formatters: {
    bar: (str) => {
      const [start, end] = str.split('|');
      return chalk.blueBright(start) + chalk.redBright(end);
    },
  }
}));


bar.start();

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
  // bar.logWrap(() => console.log('this is a test: ' + textInBarRotation.getProgress()));

}, 300);
