import {
  Bar,
  BarDataProvider,
  BarDataResult,
  BarItem,
  IProgress,
  presets,
  Progress,
} from '../';
import { loopProgresses } from './helpers';
import { SpinnerDataProvider } from '../lib/data-providers/spinner/spinner.data-provider';
import * as fs from 'fs';

const progress = new Progress<{ files: string[]; file: string }>({ total: 1 });
const scan = new Progress({ total: 100 });
const progresses = [progress, scan];

const bar = new Bar();

const barItem = new BarItem<
  never,
  {
    spinner: (progress: IProgress, progresses: IProgress[]) => string;
    spinnerQuestions: (progress: IProgress, progresses: IProgress[]) => string;
    barDots: (progress: IProgress, progresses: IProgress[]) => BarDataResult;
  }
>(progresses, {
  options: presets.rect,
  // eslint-disable-next-line max-lines-per-function
  template: ({
    bar,
    percentage,
    spinner,
    spinnerQuestions,
    barDots,
    value,
    total,
    eta,
    duration,
  }) => {
    let processing = '';
    if (progresses[0].getProgress() >= 1) {
      processing = 'DONE: processing';
    } else if (progresses[0].getProgress() > 0) {
      processing = spinner[0] + ' processing: ' + progress.getPayload().file;
    }
    const totalString = scan.getProgress() < 1 ? spinnerQuestions : total[0];
    const scanningString =
      scan.getProgress() < 1
        ? spinner[1] + ' scanning ' + barDots[1]
        : 'DONE: scanning';
    return `
      \r Files: ${value[0]} of ${totalString}
      \r Time:        ${duration[0]}, estimated ${eta[0]}
      \r [${bar[0]}] ${percentage} ${percentage}
      \r ${scanningString} 
      \r ${processing}
    `;
  },
  dataProviders: {
    spinner: new SpinnerDataProvider(
      SpinnerDataProvider.presets.BRAILLE,
      50,
    ).getProviders().spinner,
    spinnerQuestions: new SpinnerDataProvider(
      ['?', '??', '???'],
      500,
    ).getProviders().spinner,
    barDots: new BarDataProvider({
      ...presets.classic,
      completeChar: '.',
      resumeChar: ' ',
      width: 30,
    }).getProviders().bar,
  },
});

bar.add(barItem);
bar.start();

const intervals = loopProgresses([scan], () => 50);
const interval: NodeJS.Timer = setInterval(() => bar.render(), 50);

scan.on('update', e => {
  if (e.new.value >= 100) {
    clearInterval(intervals[0]);
    const files = fs.readdirSync(__dirname);
    progress.setTotal(files.length);
    progress.set(0, { files, file: files[0] });
    intervals[1] = loopProgresses([progress], () => 1000)[0];
  }
});
progress.on('update', () => {
  // eslint-disable-next-line no-console
  bar.logWrap(() => console.log('DONE', progress.getPayload().file));
  progress.getPayload().file = progress.getPayload().files[progress.getValue()];
  if (progress.getProgress() >= 1) {
    bar.logWrap(() => 'clear');
    clearInterval(interval);
    clearInterval(intervals[1]);
  }
});
