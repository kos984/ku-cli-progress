"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const render_1 = require("../render");
const bar_1 = require("../bar");
const progress_1 = require("../progress");
const progresses = [
    new progress_1.Progress({ total: 1000, render: new render_1.Render(render_1.Render.preset.shades) }),
    new progress_1.Progress({ total: 1000 })
];
const [progressClassic, progressRect] = progresses;
const bar = new bar_1.Bar(progresses, new render_1.Render(render_1.Render.preset.rect));
progressClassic.increment(300);
progressRect.increment(700);
bar.renderBars();
//# sourceMappingURL=preset.js.map