"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bar_1 = require("../bar");
const progress_1 = require("../progress");
const progresses = [];
for (let i = 0; i < 30; i++) {
    const progress = new progress_1.Progress({ total: 1000 });
    progress.increment(Math.floor(Math.random() * 1000));
    progresses.push(progress);
}
const bar = new bar_1.Bar(progresses);
bar.start().catch(console.error);
//# sourceMappingURL=multi.js.map