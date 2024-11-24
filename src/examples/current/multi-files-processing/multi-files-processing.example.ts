import { Bar, BarsFormatter, presets, Progress } from '../../../index';
import { createReadStream, ReadStream } from 'fs';
import { BarItem, ITemplateFunction } from '../../../lib/bar-items/bar-item';
import * as chalk from 'chalk';

// eslint-disable-next-line max-lines-per-function
function* PromiseConcurrent<T>(max: number, arr: Array<() => Promise<T>>) {
  const promises = arr.map(() => {
    let resolve, reject;
    return {
      promise: new Promise((..._) => ([resolve, reject] = _)),
      resolve,
      reject,
    };
  });

  const next = (function* () {
    for (let index = 0; index < arr.length; index++) {
      yield { ...promises[index], fn: arr[index] };
    }
  })();

  const active = new Set();

  const addNext = (): boolean => {
    const item = next.next().value;
    if (!item) return false;
    active.add(item);
    const done =
      cb =>
      (...params) => {
        active.delete(item);
        cb(...params);
        addNext();
      };
    item.fn().then(done(item.resolve)).catch(done(item.reject));
    return true;
  };
  while (active.size < max && addNext());
  for (const item of promises) {
    yield item.promise;
  }
}

interface IFile {
  name: string;
  size: number;
}
const files: IFile[] = [];
for (let i = 0; i < 30; i++) {
  files.push({
    name: `file_${i}.log`,
    size: Math.round(Math.random() * 297215488),
  });
}

function createReadFileStream(totalSize): ReadStream {
  const readStream = createReadStream('/dev/random');
  let left = totalSize;
  readStream.on('data', chunk => {
    left -= chunk.length;
    if (left <= 0) {
      readStream.destroy();
    }
  });
  return readStream;
}

const template: ITemplateFunction = ({
  value,
  bar,
  percentage,
  eta,
  speed,
  duration,
  total,
  progress,
}) => {
  const payload = progress.getPayload() as { name?: string };
  const name = payload.name ? ` [${payload.name}]` : '';
  return `[${bar}] ${percentage} ETA: ${eta} speed: ${speed}/s duration: ${duration}s ${value}/${total}${name}`;
};

async function loadFile(file: IFile, bar: Bar) {
  const progress = new Progress({ total: file.size }, { name: file.name });
  bar.add(
    new BarItem(progress, {
      template,
      options: {
        ...presets.rect,
        formatter: new BarsFormatter([chalk.yellow]),
      },
    }),
  );
  const stream = createReadFileStream(file.size);
  stream.on('data', chunk => progress.increment(chunk.length));
  return new Promise(resolve => {
    stream.on('close', () => {
      bar.removeByProgress(progress);
      resolve(true);
    });
  });
}

async function run() {
  const bar = new Bar().start();
  const mainProgress = new Progress({ total: files.length });
  bar.add(
    new BarItem(mainProgress, {
      options: {
        ...presets.rect,
        formatter: new BarsFormatter([chalk.magentaBright]),
      },
    }),
  );
  const concurrent = 5;
  await Promise.all(
    PromiseConcurrent(
      concurrent,
      files.map(file => {
        return async () => {
          await loadFile(file, bar);
          mainProgress.increment();
        };
      }),
    ),
  );
}

run().catch(err => console.error(err));
