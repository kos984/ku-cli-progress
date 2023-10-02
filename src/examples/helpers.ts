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
