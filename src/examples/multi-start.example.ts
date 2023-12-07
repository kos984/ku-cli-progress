import { Bar, Progress } from '../';

const bar = new Bar();
for (let i = 0; i < 7; i++) {
  bar.addProgress(
    new Progress({ total: 1000 }).increment(Math.floor(Math.random() * 1000)),
  );
}

bar.render();
