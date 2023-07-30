"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const progress_1 = require("../progress");
const bar_1 = require("../bar");
const bar_item_1 = require("../bar-item");
const barsContainer = new bar_1.Bar();
const progresses = [];
for (let i = 0; i < 30; i++) {
    const progress = new progress_1.Progress({ total: 1000 });
    progress.increment(Math.floor(Math.random() * 1000));
    progresses.push(progress);
    barsContainer.add(new bar_item_1.BarItem([progress]));
}
barsContainer.render();
//# sourceMappingURL=multi.js.map