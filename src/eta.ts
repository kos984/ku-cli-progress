import { Progress } from './progress';

export class Eta {
  protected progress?: Progress;
  protected started = Date.now();
  protected updates: {time: number, value: number}[] = [];
  protected duration = 0;
  protected speed = NaN;
  protected updated = 0;

  public attach(progress: Progress) {
    this.progress = progress;
    progress.on('tick', ({ delta, value }) => {
      if (this.updates.length && Date.now() - this.updates[this.updates.length - 1].time < 200) {
        // ignore all updates faster then 100ms
        return;
      }
      this.updates.push({
        value,
        time: Date.now(),
      });
      // console.log('updates', this.updates);
      if (this.updates.length > 5) {
        this.updates.shift();
      }
    });
  }

  public getEtaS(): number {
    const speed = this.getSpeed();
    if (Number.isNaN(speed) || !this.progress) {
      return NaN;
    }
    return Math.round((this.progress.getTotal() - this.progress.getValue()) / speed)
  }

  public getSpeed(): number {
    if (this.updates.length < 2) {
      return NaN;
    }
    if (!Number.isNaN(this.speed) && Date.now() - this.updated < 1000) {
      return this.speed;
    }
    const last = this.updates[this.updates.length - 1];
    const start = this.updates.reduce((prev, next) => {
      if (last.time - prev.time <= 5000) {
        return prev;
      }
      return next === last ? prev : next;
    });
    this.speed = ( last.value - start.value ) * 1000 / ( last.time - start.time );
    return this.speed;
  }

  public getDurationMs() {
    if ((this.progress?.getProgress() ?? 0) >= 1) {
      return this.duration;
    }
    this.duration = Date.now() - this.started;
    return this.duration;
  }
}
