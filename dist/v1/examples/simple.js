"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bar_1 = require("../bar");
const progress_1 = require("../progress");
const progress = new progress_1.Progress({ total: 1000 });
const bar = new bar_1.Bar([progress]);
progress.increment(300);
bar.renderBars();
//# sourceMappingURL=simple.js.map