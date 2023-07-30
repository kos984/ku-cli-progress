"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bars_container_1 = require("../bars-container");
const progress_1 = require("../progress");
const bar_1 = require("../bar");
const chalk = require("chalk");
const presets_1 = require("../presets");
const barsContainer = new bars_container_1.BarsContainer();
const p = new progress_1.Progress({ total: 100 });
barsContainer.add(new bar_1.Bar([p]));
barsContainer.add(new bar_1.Bar([p, new progress_1.Progress({ total: 100, start: 50, tag: 'red' }), p], {
    template: `[{bars}] {percentage} ETA: {eta} speed: {speed} duration: {duration} {red_value} {value}/{total}`,
    formatters: {
        'red_bar': str => chalk.red(str),
        'bar': str => chalk.green(str),
    }
}));
barsContainer.add(new bar_1.Bar([
    new progress_1.Progress({ total: 100, start: 50, tag: 'green' }),
    new progress_1.Progress({ total: 100, start: 65, tag: 'red' }),
    new progress_1.Progress({ total: 100, start: 78, tag: 'blue' }),
    new progress_1.Progress({ total: 100, start: 90, tag: 'yellow' }),
], {
    template: `[{bars}] {percentage} ETA: {eta} speed: {speed} duration: {duration} {value}/{total}`,
    formatters: {
        'bar': (str, index) => {
            const colors = [chalk.green, chalk.red, chalk.blue, chalk.yellow];
            return colors[index](str);
        },
    }
}));
const progressWithCustomPayload = new progress_1.Progress({ total: 100, start: 75 }, {
    user: 'John Doe',
});
barsContainer.add(new bar_1.Bar([progressWithCustomPayload], {
    template: `[{bar}] {percentage} custom: {custom}`,
    formatters: {
        user: str => chalk.bold(str),
    }
}));
barsContainer.add(new bar_1.Bar([new progress_1.Progress({ total: 100, start: 33 })], {
    options: presets_1.rect
}));
barsContainer.add(new bar_1.Bar([new progress_1.Progress({ total: 100, start: 77 })], {
    options: presets_1.shades
}));
const textInBarProgress = new progress_1.Progress({ total: 200, start: 0 });
barsContainer.add(new bar_1.Bar([textInBarProgress], {
    options: presets_1.rect,
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
const textInBarRotation = new progress_1.Progress({ total: 100, start: 0 });
function* rotate(values, timeoutMs) {
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
barsContainer.add(new bar_1.Bar([textInBarProgress], {
    template: '[{bar}] {percentage} ETA: {eta} speed: {speed} duration: {duration} {value}/{total}',
    options: presets_1.rect,
    formatters: {
        bar: str => chalk.yellowBright(str),
        percentage: (str, index, progresses) => spin.next(progresses[index].getProgress() < 1).value + ' ' + str,
    }
}));
barsContainer.add(new bar_1.Bar([textInBarProgress], {
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
barsContainer.add(new bar_1.Bar([textInBarProgress], {
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
                : percent.substr(percent.length - start.length);
            return chalk.yellowBright(text + end);
        },
    }
}));
barsContainer.add(new bar_1.Bar([textInBarProgress], {
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
barsContainer.add(new bar_1.Bar([textInBarProgress], {
    template: '[{bar}] {percentage} ETA: {eta} speed: {speed} duration: {duration} {value}/{total}',
    options: presets_1.shades,
    formatters: {
        bar: (str, index, progresses) => {
            return chalk.blueBright(str);
        },
    }
}));
barsContainer.add(new bar_1.Bar([textInBarProgress], {
    template: '[{bar}] {percentage} ETA: {eta} speed: {speed} duration: {duration} {value}/{total}',
    options: { ...presets_1.shades, glue: '|' },
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
//# sourceMappingURL=simple.bar.js.map