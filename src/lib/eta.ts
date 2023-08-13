import { IEta } from './interfaces/eta.interface';
import { IProgress, IUpdateEvent } from './interfaces/progress.interface';

export class Eta implements IEta {
  protected progress?: IProgress;
  protected started = Date.now(); // TODO: think about this
  protected updates: {time: number, value: number}[] = [];
  protected duration = 0;
  protected speed = NaN;
  protected updated = 0;

  public attachProgress(progress: IProgress): IEta {
    this.progress = progress;
    return this;
  }

  public update(params: IUpdateEvent): Eta {
    this.updates.push({
      value: params.new.value,
      time: Date.now(),
    });
    return this;
  }

  public set(count: number): Eta {
    this.updates = [{
      value: count,
      time: Date.now(),
    }];
    return this;
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

  public getDurationMs(): number {
    if ((this.progress?.getProgress() ?? 0) >= 1) {
      return this.duration;
    }
    this.duration = Date.now() - this.started;
    return this.duration;
  }
}
