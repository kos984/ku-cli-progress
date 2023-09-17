import { EventEmitter } from 'events';
import { IEta } from './eta.interface';

export interface IUpdateEvent<IPayload> {
  prev: {
    value: number;
    payload: IPayload;
  };
  new: {
    value: number;
    payload: IPayload;
  };
  total: number;
}

export interface IProgress<IPayload extends object = object> {
  emitter: EventEmitter;
  getProgress(): number;
  increment(delta: number, payload?: IPayload): IProgress<IPayload>;
  getEta(): IEta;
  getTag(): string;
  getValue(): number;
  getTotal(): number;
  getPayload(): IPayload;
  set(count: number, payload: IPayload): IProgress<IPayload>;
  on(
    type: 'update',
    listener: (e: IUpdateEvent<IPayload>) => void,
  ): IProgress<IPayload>;
}
