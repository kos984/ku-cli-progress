import { IEta } from './interfaces/eta.interface';

const defaultParams: IEtaParams = {
  deps: 5,
  debounce: 0.02,
}

export interface IEtaParams {
  /**
   * deps - indicates the number of recent instantaneous speeds used to
   * compute the average speed. As a new instantaneous speed is calculated
   * and added to the speedMoment array, greater weight is assigned to older
   * speeds. This helps to smooth out potential rapid speed changes and
   * makes the calculations more robust.
   */
  deps: number;
  /**
   * debounce - a parameter utilized to filter out minor speed fluctuations.
   * It defines the threshold at which a speed change becomes significant
   * enough to be considered in the calculations. For instance, with a
   * relatively large debounce value, small speed oscillations resulting
   * from noise or measurement inaccuracies won't affect the ETA calculations.
   */
  debounce: number;
}

export class Eta implements IEta {
  protected started!: number;
  protected last!: { time: number, count: number };
  protected left!: number;
  protected duration!: number;
  protected speedMoment = [];
  protected speed!: number;
  protected eta!: number;

  protected params: IEtaParams;

  public constructor(params?: IEtaParams) {
    this.params = {
      ...defaultParams,
      ...params,
    };
    this.set(0);
  }

  public set(count: number): IEta {
    this.left = 0;
    const time = this.getTime();
    this.speedMoment = [];
    this.speed = NaN;
    this.duration = 0;
    this.last = { count, time };
    this.started = time;
    return this;
  }

  public update(value: number, total: number): IEta {
    this.updateDuration(true);
    this.left = total - value;
    const current = {
      count: value,
      time: this.getTime(),
    };
    if (this.updateSpeedMoments(this.last, current)) {
      this.last = current;
    }
    this.updateSpeed();
    return this;
  }

  public getEtaS(): number {
    if (this.left <= 0) return NaN;
    this.updateEta();
    return this.eta;
  }

  public getSpeed(): number {
    if (this.left <= 0) return NaN;
    return this.speed;
  }

  public getDurationMs(): number {
    this.updateDuration();
    return this.duration;
  }

  protected updateEta() {
    const speed = this.getSpeed();
    if (Number.isNaN(speed) || speed === 0) {
      this.eta = NaN;
    }
    this.eta = Math.round(this.left / speed);
  }

  protected updateDuration(force = false) {
    if (!force && this.left <= 0) {
      return this.duration;
    }
    this.duration = this.getTime() - this.started;
  }

  protected updateSpeed(): void {
    let sum = 0;
    let count = 0;
    this.speedMoment.forEach((s, i) => {
      const k = 1 + (1 / this.params.deps) * i;
      sum += s * k;
      count += k;
    });
    const speed = sum / count;
    const prevSpeed = Number.isNaN(this.speed) ? 0 : this.speed;
    const k = speed / prevSpeed;
    const debounce = this.params.debounce;
    if (k > 1 && k - 1 > debounce || 1 - k > debounce) {
      this.speed = speed;
    }
  }


  protected updateSpeedMoments(prev: { count: number, time: number }, current: { count: number, time: number }): boolean {
    const timeElapsed = current.time - prev.time;
    // Ignore rapid updates and completion of progress
    if (timeElapsed < 100 || (this.left <= 0)) {
      return false;
    }
    const speed = (current.count - prev.count) * 1000 / timeElapsed;
    this.speedMoment.push(speed);
    if (this.speedMoment.length > this.params.deps) {
      this.speedMoment.shift();
    }
    return true;
  }

  protected getTime() {
    const time = Date.now();
    return time;
  }
}
