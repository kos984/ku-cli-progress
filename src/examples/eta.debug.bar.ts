import { Bar } from '../lib/bar';
import { Progress } from '../lib/progress';
import { BarItem } from '../lib/bar-item';
import * as chalk from 'chalk';
import { presets } from '../lib/presets';
import { Eta } from '../lib/eta';

const bar = new Bar();
const eta = new Eta();
const p = new Progress({ total: 100, eta });

// create simple bar
bar.add(new BarItem([p]));

bar.start();

const interval = setInterval(() => {
  let update = false;
  if (p.getProgress() < 1) {
    p.increment(1);
    update = true;
  }
  if (update === false) {
    clearInterval(interval);
  }
  bar.logWrap(() => console.log('eta: ' + eta.getEtaS()));
}, 700);
