import { EventEmitter } from 'events';
import { Progress } from '../progress';
import { Bar } from '../bar';

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
  const bars = [];
  const mainProgress = new Progress({ total: files.length });
  const bar = new Bar([mainProgress]);
  bar.start();

  files = Array.from(files).reverse();
  const promises: Promise<any>[] = [];
  const next = (): Promise<any> => {
    const file = files.pop();
    if (!file) {
      return Promise.resolve(true);
    }
    return new Promise(r => {
      const progress = new Progress({ total: file.size });
      bar.add(progress);
      const emitter = process(file);
      emitter.on('data', (size) => progress.increment(size)); // progress increment
      emitter.on('end', () => {
        bar.remove(progress);
        mainProgress.increment();
        r(true);
      });
      // on error
    }).then(() => next());
  }
  while (promises.length < batchSize) {
    promises.push(next());
  }
  await Promise.all(promises);
}

runner(files, 5).catch(err => console.log(err));
