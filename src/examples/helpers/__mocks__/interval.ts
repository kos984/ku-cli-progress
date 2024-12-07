export class Interval {
  protected intervalId!: NodeJS.Timer;
  protected time = 0;

  public start(fn: () => void): Interval {
    this.intervalId = setInterval(() => {
      fn();
      // FIXME: remove it
      // this.time += 1000;
      // (getTime as jest.Mock).mockReturnValue(this.time);
    }, 10);
    return this;
  }

  public stop(): void {
    clearInterval(this.intervalId);
  }
}
