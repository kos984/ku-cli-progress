import { Bar, BarDataProvider, presets, Progress } from '../../../index';
import { loopProgresses } from '../../helpers/loop-progresses';
import { SpinnerDataProvider } from '../../../lib/data-providers/spinner/spinner.data-provider';
import { BarItem } from '../../../lib/bar-items/bar-item/bar-item';
import * as fs from 'fs';

const mainProgress = new Progress<{ files: string[]; file: string }>({
  total: 1,
});
const scanProgress = new Progress({ total: 100 });
const progresses = [mainProgress, scanProgress];

const bar = new Bar();

const barItem = new BarItem<{
  formatters: {
    spinner: string;
  };
  dataProviders: {
    spinner: string;
    spinnerQuestions: string;
    barDots: string;
  };
}>(progresses, {
  options: presets.rect,
  // eslint-disable-next-line max-lines-per-function
  template: (main, scan) => {
    let processing = '';
    if (mainProgress.getProgress() >= 1) {
      processing = 'DONE: processing';
    } else if (mainProgress.getProgress() > 0) {
      processing =
        main.spinner + ' processing: ' + mainProgress.getPayload().file;
    }
    const totalString =
      scanProgress.getProgress() < 1 ? main.spinnerQuestions : main.total;
    const scanningString =
      scanProgress.getProgress() < 1
        ? scan.spinner + ' scanning ' + scan.barDots
        : 'DONE: scanning';
    return `
      \r Files: ${main.value} of ${totalString}
      \r Time:        ${main.duration}, estimated ${main.eta}
      \r [${main.bar}] ${main.percentage} 
      \r ${scanningString} ${scan.percentage}
      \r ${processing}
    `;
  },
  dataProviders: {
    spinner: new SpinnerDataProvider({
      ...SpinnerDataProvider.presets.BRAILLE,
      delay: 50,
    }),
    spinnerQuestions: new SpinnerDataProvider({
      chars: ['?', '??', '???'],
      delay: 500,
    }),
    barDots: new BarDataProvider({
      ...presets.classic,
      completeChar: '.',
      resumeChar: ' ',
      width: 30,
    }),
  },
});

bar.add(barItem);
bar.start();

const intervals = loopProgresses([scanProgress], () => 50);
const interval: NodeJS.Timer = setInterval(() => bar.render(), 50);

scanProgress.on('update', e => {
  if (e.new.value >= 100) {
    clearInterval(intervals[0]);
    const files = fs.readdirSync(__dirname);
    mainProgress.setTotal(files.length);
    mainProgress.set(0, { files, file: files[0] });
    intervals[1] = loopProgresses([mainProgress], () => 1000)[0];
  }
});
mainProgress.on('update', () => {
  // eslint-disable-next-line no-console
  bar.logWrap(() => console.log('DONE', mainProgress.getPayload().file));
  mainProgress.getPayload().file =
    mainProgress.getPayload().files[mainProgress.getValue()];
  if (mainProgress.getProgress() >= 1) {
    bar.logWrap(() => console.log('PROCESSING COMPLETE'));
    clearInterval(interval);
    clearInterval(intervals[1]);
  }
});
