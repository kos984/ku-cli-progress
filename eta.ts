import { Progress } from './progress';

export class Eta {
  protected progress?: Progress;
  protected started = Date.now();
  protected updates: {delta: number, time: number, value: number}[] = [];

  public attach(progress: Progress) {
    this.progress = progress;
    progress.on('tick', ({ delta, value }) => {
      if (delta === 0) return;
      this.updates.push({
        delta,
        value,
        time: Date.now(),
      });
    });
  }

  public getSpeed(): number {
    if (this.updates.length < 2) {
      return NaN;
    }
    const data = this.updates.reduce<{ start: number, end: number, total: number }>((result, current) => {
      return {
        start: result.start === 0 ? current.time : result.start,
        end: current.time,
        total: result.total + current.delta,
      };
    }, { start: 0, end: 0, total: 0 });
    return data.total * 1000 / (data.end - data.start);
  }

  public getDuration() {
    return Date.now() - this.started;
  }
}
