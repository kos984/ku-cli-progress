import { IProgress } from '../../interfaces/progress.interface';
import {
  etaFormatFunctionLong,
  etaFormatFunctionShort,
  etaFormatFunctionSimple,
  etaFormatFunctionTime,
} from './eta.presets';

export type IFormatFunction = (seconds: number) => string;

export interface IEtaDataProviderParams {
  infinitySymbol?: string;
  formatFunction?: IFormatFunction;
}

export class EtaDataProvider {
  public static presets = {
    simple: etaFormatFunctionSimple,
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
      etaHumanReadable: this.getData.bind(this),
    };
  }

  public getData(progress: IProgress): string {
    const eta = progress.getEta().getEtaS();
    return this.formatEtaHumanReadable(eta);
  }

  protected formatEtaHumanReadable = (num: number): string => {
    if (!Number.isFinite(num)) return this.infinitySymbol;
    return this.formatFunction(num);
  };
}
