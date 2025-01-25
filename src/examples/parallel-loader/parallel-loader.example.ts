import { EventEmitter } from 'events';
import { Bar, BarItem, Progress } from '../../index';
import { SeededRandom } from '../helpers/seed-random';
import { Interval } from '../helpers/interval';
import { Logger } from '../helpers/logger';
import { start } from '../helpers/loop-progresses';

interface IFile {
  size: number;
}

const rnd = new SeededRandom(2554);
export const logger = new Logger();

const files: IFile[] = [];
for (let i = 0; i < 30; i++) {
  files.push({ size: Math.round(rnd.next() * 10000) });
}

const process = (file: IFile) => {
  const emitter = new EventEmitter();
  const dataLength = 100;
  let size = file.size;
  const interval = new Interval().start(() => {
    if (dataLength < size) {
      size -= dataLength;
      return emitter.emit('data', dataLength);
    }
    emitter.emit('data', size);
    emitter.emit('end');
    interval.stop();
  }, 100);
  return emitter;
};

const next = (barsContainer: Bar, mainProgress: Progress): Promise<boolean> => {
  const file = files.pop();
  if (!file) {
    return Promise.resolve(true);
  }
  return new Promise(r => {
    const progress = new Progress({ total: file.size });
    barsContainer.add(new BarItem([progress]));
    const emitter = process(file);
    emitter.on('data', size => progress.increment(size));
    emitter.on('end', () => {
      barsContainer.logWrap(() => {
        logger.log(`file processing completed: [file.size=${file.size}]`);
      });
      barsContainer.removeByProgress(progress);
      mainProgress.increment();
      r(true);
    });
  }).then(() => next(barsContainer, mainProgress));
};

export const bar = new Bar();

const runner = async (files: IFile[], batchSize = 5) => {
  const mainProgress = new Progress({ total: files.length });
  bar.add(new BarItem([mainProgress]));
  bar.start();

  const promises: Promise<boolean>[] = [];
  while (promises.length < batchSize) {
    promises.push(next(bar, mainProgress));
  }
  await Promise.all(promises);
};

export const run = async () => {
  await runner(files, 5);
};

start(run);
