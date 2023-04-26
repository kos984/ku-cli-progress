import { ProgressRender } from '../src/progress-render';
import { Render } from '../src/render';

const render = new Render();
// const progressClassic = bar.createProgress({ total: 1000, render: Render.shades() });
// const progressRect = bar.createProgress({ total: 1000, render: Render.rect() });

// FIXME: it looks Ugly
const progressClassic = render.createProgress({ total: 1000, render: ProgressRender.create(ProgressRender.preset.shades) });
const progressRect = render.createProgress({ total: 1000, render: ProgressRender.create(ProgressRender.preset.rect) });

progressClassic.increment(300);
progressRect.increment(700);

render.renderBars();

