import { IProgress } from 'ku-progress-bar';

const delay = 100;

export function loopProgresses(
  progresses: IProgress[],
  params?: { getDelay?: () => number },
) {
  return progresses.map(progress => {
    const interval = setInterval(
      () => {
        progress.increment();
        if (progress.getProgress() >= 1) {
          clearInterval(interval);
        }
      },
      params?.getDelay ? params.getDelay() : delay,
    );
    return interval;
  });
}

export function start(f: () => Promise<void>) {
  // eslint-disable-next-line no-console
  f().catch(err => console.error(err));
}
