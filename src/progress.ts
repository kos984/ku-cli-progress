import { ProgressRender } from './progress-render';
import { EventEmitter } from 'events';
import { Eta } from './eta';

export interface IProgressParams {
  total: number;
  start?: number;
  render?: ProgressRender;
  tag?: string;
}

export class Progress extends EventEmitter {
  protected tag?: string;
  protected count: number;
  protected total: number;
  protected render?: ProgressRender;
  protected payload: any;
  protected eta: Eta;

  public constructor(params: IProgressParams) {
    super();
    this.tag = params.tag;
    this.count = params.start ?? 0;
    this.total = params.total;
    this.render = params.render;
    this.eta = new Eta();
    this.eta.attach(this);
  }

  public increment(delta: number = 1, payload: any = {}): Progress {
    const value = this.count + delta;
    this.emit('tick', { value, delta, payload: this.payload, newPayload: payload });
    return this.set(value, payload);
  }

  public set(count: number, payload: any): Progress {
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
    this.payload = payload;
    return this;
  }

  public getTotal(): number {
    return this.total;
  }

  public getValue(): number {
    return this.count;
  }

  public getProgress(): number {
    const progress = this.count / this.total;
    return progress > 1 ? 1 : progress;
  }

  public getRender(): ProgressRender | undefined {
    return this.render;
  }
  public getTag(): string | undefined {
    return this.tag;
  }

  public getDataValue(key: string) {
    const map: { [key: string]: () => string | null } = {
      bar: () => this.render ? this.render.renderBar({ progress: this }) : null,
      speed: () => Math.round(this.eta.getSpeed()) + '/s',
      eta: () => this.eta.getEtaS() + 's',
      value: () => this.getValue().toString(),
      total: () => this.getTotal().toString(),
      percentage: () => Math.round(this.getProgress() * 100) + '%',
      duration: () => Math.round(this.eta.getDurationMs() / 1000) + 's',
    }
    if (map[key]) {
      return map[key]() as string | null;
    }
    return this.payload && this.payload[key] ? this.payload[key] : null;
  }
}
