import { Render } from './render';

export interface IProgressParams {
  total: number;
  start?: number;
  render?: Render;
  tag?: string;
}

export class Progress {
  protected tag?: string;
  protected count: number;
  protected total: number;
  protected render?: Render;
  protected payload: any;

  public constructor(params: IProgressParams) {
    this.tag = params.tag;
    this.count = params.start ?? 0;
    this.total = params.total;
    this.render = params.render;
  }

  public increment(delta: number = 1, payload: any = {}): Progress {
    this.count += delta;
    this.payload = payload;
    return this;
  }

  public set(count: number, payload: any): Progress {
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
    const progress = Math.round( (this.count / this.total) * 100 ) / 100;
    return progress > 1 ? 1 : progress;
  }

  public getRender(): Render | undefined {
    return this.render;
  }
  public getTag(): string | undefined {
    return this.tag;
  }

  public getDataValue(key: string) { // FIXME: getters
    const map: { [key: string]: () => string | null } = {
      bar: () => this.render ? this.render.renderBar([this]) : null,
      eta: () => '???',
      value: () => this.getValue().toString(),
      total: () => this.getTotal().toString(),
    }
    if (map[key]) {
      return map[key]() as string | null;
    }
    return this.payload && this.payload[key] ? this.payload[key] : null;
  }
}
