import { BarDataResult } from '../../data-providers/bar/bar.data-result';
import { IProgress } from '../../interfaces/progress.interface';
import { IBarOptions } from '../../interfaces/bar-options.interface';

export type IBarFormatterLegacy = (
  str: BarDataResult,
  progress: IProgress,
  progresses: IProgress[],
) => BarDataResult | string;

export type IFormatterLegacy = (
  str: string,
  progress: IProgress,
  progresses: IProgress[],
) => string;

export interface IObjectFormatterLegacy<IFormatter> {
  formatter: IFormatter;
}

export interface IFormattersLegacy {
  bars: IBarFormatterLegacy | IObjectFormatterLegacy<IBarFormatterLegacy>;
  bar: IBarFormatterLegacy | IObjectFormatterLegacy<IBarFormatterLegacy>;
  speed: IFormatterLegacy | IObjectFormatterLegacy<IFormatterLegacy>;
  eta: IFormatterLegacy | IObjectFormatterLegacy<IFormatterLegacy>;
  etaHumanReadable: IFormatterLegacy | IObjectFormatterLegacy<IFormatterLegacy>;
  value: IFormatterLegacy | IObjectFormatterLegacy<IFormatterLegacy>;
  total: IFormatterLegacy | IObjectFormatterLegacy<IFormatterLegacy>;
  percentage: IFormatterLegacy | IObjectFormatterLegacy<IFormatterLegacy>;
  duration: IFormatterLegacy | IObjectFormatterLegacy<IFormatterLegacy>;
}

export type IDataProviderLegacy<IResult> = (
  progress: IProgress,
  progresses: IProgress[],
) => IResult;

export interface IDataProvidersLegacy {
  // [key: string]: (progress: IProgress, progresses: IProgress[]) => string;
  bars: IDataProviderLegacy<BarDataResult>;
  bar: IDataProviderLegacy<BarDataResult>;
  speed: IDataProviderLegacy<string>;
  eta: IDataProviderLegacy<string>;
  etaHumanReadable: IDataProviderLegacy<string>;
  value: IDataProviderLegacy<string>;
  total: IDataProviderLegacy<string>;
  percentage: IDataProviderLegacy<string>;
  duration: IDataProviderLegacy<string>;
}

export interface IParamsLegacy<ICustomFormatters, ICustomDataProvider> {
  tagDelimiter?: string;
  template?: ITemplateLegacy<ICustomDataProvider>;
  options?: Partial<IBarOptions>;
  formatters?: Partial<IFormattersLegacy & ICustomFormatters>;
  dataProviders?: Partial<IDataProvidersLegacy & ICustomDataProvider>;
}

export type IDataLegacy<T> = {
  [K in keyof T]: string;
} & {
  [K in keyof IDataProvidersLegacy]: string;
};

export type IFunctionTemplateLegacy<ICustomDataProvider> = (
  dataProviders: IDataLegacy<ICustomDataProvider>,
  progress: IProgress,
  progresses: IProgress[],
) => string;

export type ITemplateLegacy<ICustomDataProvider> =
  | string
  | IFunctionTemplateLegacy<ICustomDataProvider>;
