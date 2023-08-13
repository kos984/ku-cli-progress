import { EventEmitter } from 'events';
import { IEta } from './eta.interface';

export interface IUpdateEvent {
  prev: {
    value: number;
    payload: any;
  },
  new: {
    value: number;
    payload: any;
  },
  total: number;
}

export interface IProgress {
  emitter: EventEmitter;
  getProgress(): number;
  getEta(): IEta;
  getTag(): string;
  getValue(): number;
  getTotal(): number;
  getPayload(): object;
  set(count: number, payload: any): IProgress;
  on( type: 'update', listener: (e: IUpdateEvent) => void ): IProgress;
}
