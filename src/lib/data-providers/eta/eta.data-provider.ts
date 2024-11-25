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

export interface IEtaDataProviderParams {
  infinitySymbol?: string;
  formatFunction?: IFormatFunction;
}

export class EtaDataProvider {
  public static presets = {
    short: etaFormatFunctionShort,
    long: etaFormatFunctionLong,
    time: etaFormatFunctionTime,
  };

  protected formatFunction!: IFormatFunction;
  protected infinitySymbol!: string;

  public constructor(protected params: IEtaDataProviderParams = {}) {
    this.formatFunction = params.formatFunction || etaFormatFunctionShort;
    this.infinitySymbol =
      typeof params.infinitySymbol === 'string'
        ? params.infinitySymbol
        : '\u221E';
  }

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
    if (!Number.isFinite(num)) return this.infinitySymbol;
    const data: IFormatPayload[] = [
      { period: 3600 * 24, name: ETimePeriodKey.days },
      { period: 3600, name: ETimePeriodKey.hours },
      { period: 60, name: ETimePeriodKey.minutes },
      { period: 1, name: ETimePeriodKey.seconds },
    ].reduce(
      ({ n, result }, { period, name }) => {
        result.push({ period, name, value: Math.floor(n / period) });
        return { n: n % period, result };
      },
      { n: num, result: [] },
    ).result;
    return this.formatFunction(data.pop(), ...data.reverse());
  };
}
