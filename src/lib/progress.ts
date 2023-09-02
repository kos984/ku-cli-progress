import * as EventEmitter from 'events';
import { IProgress, IUpdateEvent } from './interfaces/progress.interface';
import { IEta } from './interfaces/eta.interface';
import { Eta } from './eta';

export interface IProgressParams {
  total: number;
  start?: number;
  tag?: string;
  eta?: IEta;
}

export class Progress<IPayload> implements IProgress {
  public readonly emitter: EventEmitter = new EventEmitter();
  protected tag?: string;
  protected count: number;
  protected total: number;
  protected payload: IPayload;
  protected eta: IEta;

  public constructor(params: IProgressParams, payload?: IPayload) {
    this.tag = params.tag;
    this.count = params.start ?? 0;
    this.total = params.total;
    this.eta = params.eta ?? new Eta();
    this.payload = payload;
  }

  public increment(delta: number = 1, payload?: any): IProgress {
    return this.update(this.count + delta, payload);
  }

  public set(count: number, payload: any = {}): IProgress {
    this.count = count;
    this.payload = payload;
    this.eta.set(count);
    return this;
  }

  public on(type: "update", listener: (e: IUpdateEvent) => void): IProgress {
    this.emitter.on(type, listener);
    return this;
  }

  protected update(count: number, payload?: any): IProgress {
    const updatePayload = {
      prev: {
        value: this.count,
        payload: this.payload
      },
      new: {
        value: count,
        payload,
      },
      total: this.total,
    }
    this.emitter.emit('update', updatePayload);
    this.eta.update(count, this.total);
    this.count = count;
    this.payload = payload !== undefined ? payload : this.payload;
    // FIXME: add test about override
    return this;
  }

  public getTotal(): number {
    return this.total;
  }

  public getValue(): number {
    return this.count;
  }

  public getPayload(): IPayload {
    return this.payload;
  }

  public getProgress(): number {
    const progress = this.count / this.total;
    return progress > 1 ? 1 : progress;
  }

  public getTag(): string | undefined {
    return this.tag;
  }

  public getEta(): IEta {
    return this.eta;
  }
}
