import { Bar, presets, Progress } from '../../';
import { loopProgresses } from '../helpers';
import { BarItem } from '../../lib/bar-item';

const bar = new Bar();
const progresses = [1e2, 1e3, 1e4, 1e5, 1e6, 1e7].map(
  total => new Progress({ total }),
);

/*
[⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣤⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀] 38% ETA: 6s speed: 10/s duration: 4s 38/100
[⣿⣶⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀] 4% ETA: 1m38s speed: 10/s duration: 4s 38/1000
[⣤⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀] 0% ETA: 16m56s speed: 10/s duration: 4s 38/10000
[⣄⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀] 0% ETA: 2h49m56s speed: 10/s duration: 4s 38/100000
[⣄⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀] 0% ETA: 1d4h19m56s speed: 10/s duration: 4s 38/1000000
[⣄⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀] 0% ETA: 11d19h19m56s speed: 10/s duration: 4s 38/10000000
 */
progresses.forEach(progress => {
  bar.add(
    new BarItem(progress, {
      template: ({
        percentage,
        bar,
        etaHumanReadable,
        speed,
        duration,
        value,
        total,
      }) =>
        `[${bar}] ${percentage} ETA: ${etaHumanReadable} speed: ${speed}/s duration: ${duration}/s ${value}/${total}`,
      options: presets.braille,
    }),
  );
});

bar.start();

loopProgresses(progresses);
