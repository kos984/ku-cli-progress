"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const render_1 = require("../render");
const progress_1 = require("../progress");
const bar_1 = require("../bar");
const chalk_1 = require("chalk");
let progresses = [];
const formatBarWithTextInCenter = (barString, progress, text) => {
    const done = Math.round(progress.getProgress() * barString.length);
    const start = barString.substr(0, barString.length / 2 - text.length / 2 - 1);
    const end = barString.substr(barString.length / 2 + text.length / 2 + 1);
    const out = `${start} ${text} ${end}`;
    return chalk_1.default.yellowBright(out.substr(0, done)) + out.substr(done);
};
progresses = [
    new progress_1.Progress({
        total: 1030,
        render: new render_1.Render({
            bar: {
                glue: '',
                completeChar: '∎',
                resumeChar: ' ',
            },
            format: {
                bar: (str, [progress]) => {
                    const percentage = (Math.round(progress.getProgress() * 10000) / 100).toFixed(2) + '%';
                    return formatBarWithTextInCenter(str, progress, percentage + ' ETA: ' + progress.getDataValue('eta'));
                },
            }
        }),
    }),
    new progress_1.Progress({
        total: 1000,
        render: new render_1.Render({
            bar: {
                glue: '',
                completeChar: '∎',
                resumeChar: ' ',
            },
            format: {
                bar: (str, [progress]) => formatBarWithTextInCenter(str, progress, progress.getDataValue('percentage')),
            }
        }),
    }),
    new progress_1.Progress({
        total: 2000,
        render: new render_1.Render({
            bar: {
                glue: '|',
                completeChar: '█',
                resumeChar: '░',
            },
            format: {
                bar: str => str.split('|').reduce((complete, left) => chalk_1.default.green(complete) + chalk_1.default.redBright(left)),
            }
        }),
    }),
    [
        new progress_1.Progress({ start: 20, total: 1000, tag: 'red', render: new render_1.Render({
                template: `[{bars}] {test} {eta} {red_value}/{red_total} | {blue_value}/{blue_total}`,
                format: {
                    value: str => chalk_1.default.red(str),
                    total: str => chalk_1.default.red(str),
                    bar: str => chalk_1.default.red(str),
                    bars: str => chalk_1.default.green(str),
                }
            }) }),
        new progress_1.Progress({ start: 50, total: 1000, tag: 'blue', render: new render_1.Render({
                format: {
                    value: str => Number(str) > 100 ? chalk_1.default.green(str) : chalk_1.default.blue(str),
                    total: str => chalk_1.default.blue(str),
                    bar: str => chalk_1.default.blue(str),
                }
            }) })
    ],
    new progress_1.Progress({ total: 5000, render: new render_1.Render({
            bar: {
                resumeChar: '▢',
                completeChar: '▣',
            }
        }) }),
];
const bar = new bar_1.Bar(progresses);
bar.start();
setInterval(() => {
    progresses.forEach((p) => {
        if (Array.isArray(p)) {
            p.forEach(i => {
                if (i.getProgress() < 1) {
                    i.increment(Math.round(Math.random() * 10), { test: '[some addition data]' });
                }
            });
        }
        else {
            if (p.getProgress() < 1) {
                p.increment(10);
            }
        }
    });
}, 100);
//# sourceMappingURL=test.js.map