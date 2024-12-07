export class Interval {
  protected intervalId!: NodeJS.Timer;

  public start(fn: () => void, ms: number): Interval {
    this.intervalId = setInterval(fn, ms);
    return this;
  }

  public stop(): void {
    clearInterval(this.intervalId);
  }
}
