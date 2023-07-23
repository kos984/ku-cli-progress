import { BarsContainer } from '../bars-container';
import { Progress } from '../progress';
import { Bar } from '../bar';
// @ts-ignore
import chalk from 'chalk';

const barsContainer = new BarsContainer();
const template = `[{bar}] {percentage} ETA: {eta} speed: {speed} duration: {duration} {value}/{total}`;

const p = new Progress({ total: 100 });
const options = {
  completeChar: '=',
  resumeChar: '-',
  width: 40,
  glue: '',
}
barsContainer.add(new Bar([p], template, options));

barsContainer.add(new Bar([p, new Progress({ total: 100, start: 50, tag: 'red' }), p], // TODO: change tag logic ???
  `[{bars}] {percentage} ETA: {eta} speed: {speed} duration: {duration} {red_value} {value}/{total}`
  , options, {
    'red_bar': str => chalk.red(str),
  }) as any); // FIXME: remove any

barsContainer.render();

p.increment(15);

barsContainer.render();
