import { IProgress } from './interfaces/progress.interface';
import { IBarItem } from './interfaces/bar-item.interface';
import { EventEmitter } from 'events';
import { Eta } from './eta';

export interface IProgressParams {
  total: number;
  start?: number;
  tag?: string;
}

export class Progress extends EventEmitter implements IProgress, IBarItem {
  protected tag?: string;
  protected count: number;
  protected total: number;
  protected payload: any;
  protected eta: Eta;

  public constructor(params: IProgressParams, payload = {}) {
    super();
    this.tag = params.tag;
    this.count = params.start ?? 0;
    this.total = params.total;
    this.eta = new Eta();
    this.eta.attach(this);
    this.payload = payload;
  }

  public increment(delta: number = 1, payload?: any): Progress {
    return this.update(this.count + delta, payload);
  }

  public set(count: number, payload: any): Progress {
    this.count = count;
    this.payload = payload;
    // FIXME: clean all timers, or just call update with diff ?
    return this;
  }

  protected update(count: number, payload?: any): Progress {
    this.emit('update', {
      prev: {
        value: this.count,
        payload: this.payload
      },
      new: {
        value: count,
        payload,
      }
    });
    this.count = count;
    this.payload = payload ? payload : this.payload;
    // FIXME: add test about override
    return this;
  }

  public getTotal(): number {
    return this.total;
  }

  public getValue(): number {
    return this.count;
  }

  public getPayload(): any {
    return this.payload ?? {};
  }

  public getProgress(): number {
    const progress = this.count / this.total;
    return progress > 1 ? 1 : progress;
  }

  // FIXME: do I need it ?
  public getTag(): string | undefined {
    return this.tag;
  }

  public getEta(): Eta {
    return this.eta;
  }
}
