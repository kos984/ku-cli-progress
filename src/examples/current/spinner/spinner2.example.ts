import {
  Bar,
  BarDataProvider,
  BarDataResult,
  IDataProviders,
  IProgress,
  ITemplateFunction,
  presets,
  Progress,
} from '../../../index';
import { loopProgresses } from '../../helpers/loop-progresses';
import { SpinnerDataProvider } from '../../../lib/data-providers/spinner/spinner.data-provider';
import { BarItem } from '../../../lib/bar-items/bar-item';
import * as fs from 'fs';

class Template {
  protected spinner = new SpinnerDataProvider({
    ...SpinnerDataProvider.presets.BRAILLE,
    delay: 50,
  }).getProviders().spinner;
  protected spinnerQuestions = new SpinnerDataProvider({
    chars: ['?', '??', '???'],
    delay: 500,
  }).getProviders().spinner;
  protected barDots = new BarDataProvider({
    ...presets.classic,
    completeChar: '.',
    resumeChar: ' ',
    width: 30,
  }).getProviders().bar;

  protected buildDataProviders(provider: {
    progress: IProgress;
    progresses: IProgress[];
  }): { spinner: string; spinnerQuestions: string; barDots: BarDataResult } {
    const { spinner, spinnerQuestions, barDots } = this;
    return {
      get spinner() {
        return spinner(provider.progress, provider.progresses);
      },
      get spinnerQuestions() {
        return spinnerQuestions(provider.progress, provider.progresses);
      },
      get barDots() {
        return barDots(provider.progress, provider.progresses);
      },
    };
  }

  protected getProcessingString(main: IDataProviders): string {
    if (main.progress.getProgress() >= 1) {
      return 'DONE: processing';
    } else if (main.progress.getProgress() > 0) {
      const file = (main.progress.getPayload() as { file: string }).file;
      const spinner = this.buildDataProviders(main).spinner;
      return `${spinner} processing: ${file}`;
    }
    return '';
  }

  protected getTotalFilesString(main: IDataProviders): string {
    return scanProgress.getProgress() < 1
      ? this.spinnerQuestions(main.progress, main.progresses)
      : main.total.toString();
  }

  protected getScanningString(scan: IDataProviders): string {
    if (scan.progress.getProgress() < 1) {
      const { spinner, barDots } = this.buildDataProviders(scan);
      return `${spinner} scanning ${barDots}`;
    }
    return `DONE: scanning ${scan.percentage}`;
  }

  public render: ITemplateFunction = (main, scan) => {
    return [
      `Files: ${main.value} of ${this.getTotalFilesString(main)}`,
      `Time:        ${main.duration}, estimated ${main.eta}`,
      `[${main.bar}] ${main.percentage}`,
      `${this.getScanningString(scan)} ${scan.percentage}`,
      this.getProcessingString(main),
    ]
      .filter(Boolean)
      .join('\n\r');
  };
}

const mainProgress = new Progress<{ files: string[]; file: string }>({
  total: 1,
});
const scanProgress = new Progress({ total: 100 });
const progresses = [mainProgress, scanProgress];

const bar = new Bar();

const barItem = new BarItem(progresses, {
  options: presets.rect,
  template: new Template().render,
});

bar.add(barItem);
bar.start();

const intervals = loopProgresses([scanProgress], { getDelay: () => 50 });
const interval: NodeJS.Timer = setInterval(() => bar.render(), 50);

scanProgress.on('update', e => {
  if (e.new.value >= 100) {
    clearInterval(intervals[0]);
    const files = fs.readdirSync(__dirname);
    mainProgress.setTotal(files.length);
    mainProgress.set(0, { files, file: files[0] });
    intervals[1] = loopProgresses([mainProgress], { getDelay: () => 1000 })[0];
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
