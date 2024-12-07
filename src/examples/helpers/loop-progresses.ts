export function loopProgresses(progresses, delay = () => 100) {
  return progresses.map(progress => {
    const interval = setInterval(() => {
      progress.increment();
      if (progress.getProgress() >= 1) {
        clearInterval(interval);
      }
    }, delay());
    return interval;
  });
}

export function start(f: () => Promise<void>) {
  // eslint-disable-next-line no-console
  f().catch(err => console.error(err));
}
