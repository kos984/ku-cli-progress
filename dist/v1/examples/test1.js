"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const render_1 = require("../render");
const progress_1 = require("../progress");
const bar_1 = require("../bar");
const chalk_1 = require("chalk");
let progresses = [];
progresses = [
    new progress_1.Progress({
        total: 1000,
        render: new render_1.Render({
            bar: {
                glue: '',
                completeChar: '∎',
                resumeChar: ' ',
            },
            format: {
                bar: (str, [progress]) => {
                    const done = Math.round(progress.getProgress() * str.length);
                    const percentage = progress.getDataValue('percentage');
                    const start = str.substr(0, str.length / 2 - percentage.length / 2 - 1);
                    const end = str.substr(str.length / 2 + percentage.length / 2 + 1);
                    const out = `${start} ${percentage} ${end}`;
                    return chalk_1.default.yellowBright(out.substr(0, done)) + out.substr(done);
                },
            }
        }),
    }),
];
const bar = new bar_1.Bar(progresses);
bar.start();
setInterval(() => {
    progresses.forEach((p) => {
        if (p.getProgress() < 1) {
            p.increment(10);
        }
    });
}, 300);
//# sourceMappingURL=test1.js.map