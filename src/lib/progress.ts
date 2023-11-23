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

export class Progress<IPayload extends object = object>
  implements IProgress<IPayload>
{
  public readonly emitter: EventEmitter = new EventEmitter();
  protected tag?: string;
  protected count: number;
  protected total: number;
  protected payload: IPayload;
  protected eta: IEta;

  public constructor(
    params: IProgressParams,
    payload: IPayload = {} as IPayload,
  ) {
    this.tag = params.tag;
    this.count = params.start ?? 0;
    this.total = params.total;
    this.eta = params.eta ?? new Eta();
    this.payload = payload;
  }

  public increment(delta: number = 1, payload?: IPayload): IProgress<IPayload> {
    return this.update(this.count + delta, payload);
  }

  public set(
    count: number,
    payload: IPayload = {} as IPayload,
  ): IProgress<IPayload> {
    this.count = count;
    this.payload = payload;
    this.eta.set(count);
    return this;
  }

  public setTotal(total: number) {
    this.total = total;
    return this;
  }

  public on(
    type: 'update',
    listener: (e: IUpdateEvent<IPayload>) => void,
  ): IProgress<IPayload> {
    this.emitter.on(type, listener);
    return this;
  }

  protected update(count: number, payload?: IPayload): IProgress<IPayload> {
    const updatePayload = {
      prev: {
        value: this.count,
        payload: this.payload,
      },
      new: {
        value: count,
        payload,
      },
      total: this.total,
    };
    this.eta.update(count, this.total);
    this.count = count;
    this.payload = payload ?? this.payload;
    this.emitter.emit('update', updatePayload);
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
