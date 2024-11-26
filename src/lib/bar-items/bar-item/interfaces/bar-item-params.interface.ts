import { IBarOptions } from '../../../interfaces/bar-options.interface';
import { IDataProvider } from './data-provider';
import { ICustomInterfacesExtends } from '../';
import { ITemplateFunction } from './template-function.interface';

export interface IBarItemParams<
  ICustomInterfaces extends ICustomInterfacesExtends,
> {
  template?: ITemplateFunction<ICustomInterfaces['dataProviders']>;
  options?: Partial<IBarOptions>;
  dataProviders?: Record<
    string,
    IDataProvider<unknown> | { getData: IDataProvider<unknown> }
  >;
}
