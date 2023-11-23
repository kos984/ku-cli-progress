import { Progress, SpinnerDataProvider, BarItem, IDataProvider } from '../../';

jest.mock('../time');
import { getTime } from '../time';
const getTimeMock = getTime as jest.Mock;

describe('spinner.data-provider', () => {
  it('SLASH', () => {
    const progress = new Progress({ total: 100 });
    const spinnerDataProvider = new SpinnerDataProvider(
      SpinnerDataProvider.presets.SLASH,
    );
    getTimeMock
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(501)
      .mockReturnValueOnce(1002)
      .mockReturnValueOnce(1302)
      .mockReturnValueOnce(1503)
      .mockReturnValueOnce(2004);
    const barItem = new BarItem<never, { spinner: IDataProvider<string> }>(
      progress,
      {
        template: ({ spinner }) => `[${spinner}]`,
        dataProviders: {
          spinner: spinnerDataProvider.getProviders().spinner,
        },
      },
    );
    expect(barItem.render()).toEqual('[\\]');
    expect(barItem.render()).toEqual('[|]');
    expect(barItem.render()).toEqual('[/]');
    expect(barItem.render()).toEqual('[/]');
    expect(barItem.render()).toEqual('[-]');
    expect(barItem.render()).toEqual('[\\]');
  });
  it('BRAILLE', () => {
    const progress = new Progress({ total: 100 });
    const spinnerDataProvider = new SpinnerDataProvider(
      SpinnerDataProvider.presets.BRAILLE,
    );
    (getTime as jest.Mock)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(501)
      .mockReturnValueOnce(1002)
      .mockReturnValueOnce(1302)
      .mockReturnValueOnce(1503);
    const barItem = new BarItem<never, { spinner: IDataProvider<string> }>(
      progress,
      {
        template: ({ spinner }) => `[${spinner}]`,
        dataProviders: {
          spinner: spinnerDataProvider.getProviders().spinner,
        },
      },
    );
    expect(barItem.render()).toEqual('[⠹]');
    expect(barItem.render()).toEqual('[⠸]');
    expect(barItem.render()).toEqual('[⠼]');
    expect(barItem.render()).toEqual('[⠼]');
    expect(barItem.render()).toEqual('[⠴]');
  });
  it('custom', () => {
    const progress = new Progress({ total: 100 });
    const spinnerDataProvider = new SpinnerDataProvider(['.  ', '.. ', '...']);
    (getTime as jest.Mock)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(501)
      .mockReturnValueOnce(1002)
      .mockReturnValueOnce(1302)
      .mockReturnValueOnce(1503);
    const barItem = new BarItem<never, { spinner: IDataProvider<string> }>(
      progress,
      {
        template: ({ spinner }) => `[${spinner}]`,
        dataProviders: {
          spinner: spinnerDataProvider.getProviders().spinner,
        },
      },
    );
    expect(barItem.render()).toEqual('[.  ]');
    expect(barItem.render()).toEqual('[.. ]');
    expect(barItem.render()).toEqual('[...]');
    expect(barItem.render()).toEqual('[...]');
    expect(barItem.render()).toEqual('[.  ]');
  });
});
