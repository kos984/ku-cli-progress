import { Bar, BarsFormatter, presets, Progress } from '../../index';
import { createReadStream, ReadStream } from 'fs';
import { BarItem, ITemplateFunction } from '../../lib/bar-items/bar-item';
import * as chalk from 'chalk';
import { SeededRandom } from '../helpers/seed-random';
import { start } from '../helpers/loop-progresses';

const rnd = new SeededRandom(2342);

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
    size: Math.round(rnd.next() * 297215488), // 297215488
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

const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

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
  return `[${bar}] ${percentage} ETA: ${eta} speed: ${speed}/s duration: ${duration}s ${formatBytes(
    value,
  )}/${formatBytes(total)}${name}`;
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

export const bar = new Bar().start();

// eslint-disable-next-line max-lines-per-function
export async function run() {
  const mainProgress = new Progress(
    { total: files.length },
    {
      done: 0,
      total: files.reduce((sum: number, file) => sum + file.size, 0),
    },
  );
  bar.add(
    new BarItem<{
      dataProviders: { dataProcessed: string; dataTotal: string };
      payload: { done: number; total: number };
    }>(mainProgress, {
      template: ({
        value,
        bar,
        percentage,
        speed,
        duration,
        etaHumanReadable,
        total,
        dataProcessed,
        dataTotal,
      }) =>
        `[${bar}] ${percentage}% ETA: ${etaHumanReadable} speed: ${speed}/s duration: ${duration}s ${value}/${total} [${dataProcessed}/${dataTotal}]`,
      options: {
        ...presets.rect,
        formatter: new BarsFormatter([chalk.magentaBright]),
      },
      dataProviders: {
        dataProcessed: {
          getData: progress => formatBytes(progress.getPayload().done),
        },
        dataTotal: {
          getData: progress => formatBytes(progress.getPayload().total),
        },
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
          mainProgress.getPayload().done += file.size;
          mainProgress.increment(1);
        };
      }),
    ),
  );
}

start(run);
