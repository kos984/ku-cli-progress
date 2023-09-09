import { EventEmitter } from 'events';
import { Bar } from '../lib/bar';
import { BarItem } from '../lib/bar-item';
import { Progress } from '../lib/progress';

interface IFile {
  size: number;
}
const files: IFile[] = [];
for (let i = 0; i < 30; i++) {
  files.push({ size: Math.round(Math.random() * 10000) })
}

const process = (file: IFile) => {
  const emitter = new EventEmitter();
  const dataLength = 100;
  let size = file.size;
  const interval = setInterval(() => {
    if (dataLength < size) {
      size -= dataLength;
      return emitter.emit('data', dataLength);
    }
    emitter.emit('data', size);
    emitter.emit('end');
    clearInterval(interval);
  }, 100);
  return emitter;
}

const runner = async (files: IFile[], batchSize = 5) => {
  const mainProgress = new Progress({ total: files.length });
  // const bar = new BarItem([mainProgress]);
  // bar.start();
  const barsContainer = new Bar();
  barsContainer.add(new BarItem([mainProgress]));
  barsContainer.start();

  files = Array.from(files).reverse();
  const promises: Promise<boolean>[] = [];
  const next = (): Promise<boolean> => {
    const file = files.pop();
    if (!file) {
      return Promise.resolve(true);
    }
    return new Promise(r => {
      const progress = new Progress({ total: file.size });
      barsContainer.add(new BarItem([progress]))
      const emitter = process(file);
      emitter.on('data', (size) => progress.increment(size)); // progress increment
      emitter.on('end', () => {
        barsContainer.logWrap(() => {
          console.log('some progress done');
        });
        barsContainer.removeByProgress(progress);
        mainProgress.increment();
        r(true);
      });
    }).then(() => next());
  }
  while (promises.length < batchSize) {
    promises.push(next());
  }
  await Promise.all(promises);
}

runner(files, 5).catch(err => console.log(err));
