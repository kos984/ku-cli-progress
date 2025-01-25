import { Bar, BarItem, presets, Progress } from 'ku-progress-bar';
import { loopProgresses } from '../helpers/loop-progresses';

const bar = new Bar();
const progress = new Progress({ total: 100 });
bar.start();

for (const presetKey of Object.keys(presets)) {
  const presetName = presetKey.padEnd(7, ' ');
  bar.add(
    new BarItem(progress, {
      options: presets[presetKey],
      template: ({ bar, percentage, eta, speed, duration, value, total }) =>
        ` ${presetName} [${bar}] ${percentage} ETA: ${eta} speed: ${speed} duration: ${duration} ${value}/${total}`,
    }),
  );
}

loopProgresses([progress]);
