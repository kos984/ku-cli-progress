import { IDataProviders } from './data-providers';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ITemplateFunction<ICustomDataProvider = any> = (
  ...args: (IDataProviders & ICustomDataProvider)[]
) => string;
