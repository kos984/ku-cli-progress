import { IBarOptions } from '../../interfaces/bar-options.interface';
import { IProgress } from '../../interfaces/progress.interface';
import { IBarItem } from '../../interfaces/bar-item.interface';
import { BarDataProvider } from '../../data-providers/bar/bar.data-provider';
import { defaultTemplate } from '../../templates/default.template';
import { EtaDataProvider } from '../../data-providers/eta/eta.data-provider';
import { IDataProviders } from './interfaces/data-providers';
import { ITemplateFunction } from './interfaces/template-function.interface';
import { ICustomInterfacesExtends } from './interfaces/custom-interfaces-extends.interface';
import { IBarItemParams } from './interfaces/bar-item-params.interface';
import { DataProviders } from '../../data-providers/data-providers';

export class BarItem<ICustomInterfaces extends ICustomInterfacesExtends>
  implements IBarItem
{
  protected template!: ITemplateFunction<ICustomInterfaces['dataProviders']>;
  protected options: IBarOptions = {
    completeChar: '=',
    resumeChar: '-',
    width: 40,
    glue: '',
  };
  protected dataProviders!: (IDataProviders &
    ICustomInterfaces['dataProviders'])[];
  protected progresses: IProgress[];

  public constructor(
    progresses: IProgress | IProgress[],
    params?: IBarItemParams<ICustomInterfaces>,
  ) {
    this.progresses = Array.isArray(progresses) ? progresses : [progresses];
    this.template = params?.template ?? defaultTemplate;
    this.options = { ...this.options, ...params?.options };
    const barDataProvider = new BarDataProvider(this.options).getProviders();
    const etaDataProvider = new EtaDataProvider().getProviders();
    this.dataProviders = this.progresses.map(progress => {
      return new DataProviders({
        progress,
        progresses: this.progresses,
        customDataProviders: [
          barDataProvider,
          etaDataProvider,
          params?.dataProviders,
        ].filter(Boolean),
      }) as never as IDataProviders & ICustomInterfaces['dataProviders']; // FIXME: need to double check
    });
  }

  public getProgresses(): IProgress[] {
    return this.progresses;
  }

  public render(): string {
    return this.template(...this.dataProviders);
  }
}
