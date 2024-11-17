import { IProgress } from '../../interfaces/progress.interface';
import { IFormatPayload } from './types';
import {
  etaFormatFunctionLong,
  etaFormatFunctionShort,
  etaFormatFunctionTime,
} from './eta.presets';

export { IFormatPayload } from './types';

export enum ETimePeriodKey {
  days = 'd',
  hours = 'h',
  minutes = 'm',
  seconds = 's',
}

export type IFormatFunction = (
  seconds: IFormatPayload,
  minutes?: IFormatPayload,
  hours?: IFormatPayload,
  days?: IFormatPayload,
) => string;

export const etaFunctionPresets = {
  etaFormatFunctionShort,
  etaFormatFunctionLong,
  etaFormatFunctionTime,
};

export class EtaDataProvider {
  public constructor(
    protected formatFunction: IFormatFunction = etaFormatFunctionShort,
  ) {}

  public getProviders(): {
    etaHumanReadable: (progress: IProgress, progresses: IProgress[]) => string;
  } {
    return {
      etaHumanReadable: (progress: IProgress): string => {
        const eta = progress.getEta().getEtaS();
        return this.formatEtaHumanReadable(eta);
      },
    };
  }

  protected formatEtaHumanReadable = (num: number): string => {
    if (!Number.isFinite(num)) return '\u221E'; // FIXME: think about it
    const data: IFormatPayload[] = [
      { period: 3600 * 24, name: ETimePeriodKey.days },
      { period: 3600, name: ETimePeriodKey.hours },
      { period: 60, name: ETimePeriodKey.minutes },
      { period: 1, name: ETimePeriodKey.seconds },
    ].reduce(
      ({ n, result }, { period, name }) => {
        const value = Number.isFinite(n) ? Math.floor(n / period) : n;
        result.push({ period, name, value });
        return { n: n % period, result };
      },
      { n: num, result: [] },
    ).result;
    return this.formatFunction(data.pop(), ...data.reverse());
  };
}
