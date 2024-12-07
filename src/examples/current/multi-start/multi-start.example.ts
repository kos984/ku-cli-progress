import { Bar, Progress } from '../../../index';
import { start } from '../../helpers/loop-progresses';
import { SeededRandom } from '../../helpers/seed-random';

const rnd = new SeededRandom(2342);

export const bar = new Bar();
for (let i = 0; i < 7; i++) {
  bar.addProgress(
    new Progress({ total: 1000 }).increment(Math.floor(rnd.next() * 1000)),
  );
}

start(async () => {
  bar.render();
});
