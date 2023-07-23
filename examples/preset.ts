import { Render } from '../src/render';
import { Bar } from '../src/bar';
import { Progress } from '../src/progress';

const progresses = [
  new Progress({ total: 1000, render: new Render(Render.preset.shades) }),
  new Progress({ total: 1000 })
  // new Progress({ total: 1000, render: new Bar(Bar.preset.rect) })
]

const [progressClassic, progressRect] = progresses;
const bar = new Bar(progresses,
  new Render(Render.preset.rect)
);

progressClassic.increment(300);
progressRect.increment(700);

bar.renderBars();

