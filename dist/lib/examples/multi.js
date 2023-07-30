"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const progress_1 = require("../progress");
const bars_container_1 = require("../bars-container");
const bar_1 = require("../bar");
const barsContainer = new bars_container_1.BarsContainer();
const progresses = [];
for (let i = 0; i < 30; i++) {
    const progress = new progress_1.Progress({ total: 1000 });
    progress.increment(Math.floor(Math.random() * 1000));
    progresses.push(progress);
    barsContainer.add(new bar_1.Bar([progress]));
}
barsContainer.render();
//# sourceMappingURL=multi.js.map