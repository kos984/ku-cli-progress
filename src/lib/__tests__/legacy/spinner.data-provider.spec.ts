import {
  Progress,
  SpinnerDataProvider,
  BarItemLegacy,
  IDataProviderLegacy,
} from '../../../';

jest.mock('../../time/time');
import { Time } from '../../time/time';
// const getTimeMock = getTime as jest.Mock;

describe('spinner.data-provider', () => {
  it('SLASH', () => {
    const progress = new Progress({ total: 100 });
    const time = new Time() as jest.Mocked<Time>;
    time.getTime
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(501)
      .mockReturnValueOnce(1002)
      .mockReturnValueOnce(1302)
      .mockReturnValueOnce(1503)
      .mockReturnValueOnce(2004);
    const spinnerDataProvider = new SpinnerDataProvider({
      ...SpinnerDataProvider.presets.SLASH,
      time,
    });
    const barItem = new BarItemLegacy<
      never,
      { spinner: IDataProviderLegacy<string> }
    >(progress, {
      template: ({ spinner }) => `[${spinner}]`,
      dataProviders: {
        spinner: spinnerDataProvider.getProviders().spinner,
      },
    });
    expect(barItem.render()).toEqual('[\\]');
    expect(barItem.render()).toEqual('[|]');
    expect(barItem.render()).toEqual('[/]');
    expect(barItem.render()).toEqual('[/]');
    expect(barItem.render()).toEqual('[-]');
    expect(barItem.render()).toEqual('[\\]');
  });
  it('BRAILLE', () => {
    const progress = new Progress({ total: 100 });
    const time = new Time() as jest.Mocked<Time>;
    time.getTime
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(501)
      .mockReturnValueOnce(1002)
      .mockReturnValueOnce(1302)
      .mockReturnValueOnce(1503)
      .mockReturnValueOnce(2004);
    const spinnerDataProvider = new SpinnerDataProvider({
      ...SpinnerDataProvider.presets.BRAILLE,
      time,
    });
    const barItem = new BarItemLegacy<
      never,
      { spinner: IDataProviderLegacy<string> }
    >(progress, {
      template: ({ spinner }) => `[${spinner}]`,
      dataProviders: {
        spinner: spinnerDataProvider.getProviders().spinner,
      },
    });
    expect(barItem.render()).toEqual('[⠹]');
    expect(barItem.render()).toEqual('[⠸]');
    expect(barItem.render()).toEqual('[⠼]');
    expect(barItem.render()).toEqual('[⠼]');
    expect(barItem.render()).toEqual('[⠴]');
  });
  it('custom', () => {
    const progress = new Progress({ total: 100 });
    const time = new Time() as jest.Mocked<Time>;
    time.getTime
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(501)
      .mockReturnValueOnce(1002)
      .mockReturnValueOnce(1302)
      .mockReturnValueOnce(1503)
      .mockReturnValueOnce(2004);
    const spinnerDataProvider = new SpinnerDataProvider({
      chars: ['.  ', '.. ', '...'],
      time,
    });
    const barItem = new BarItemLegacy<
      never,
      { spinner: IDataProviderLegacy<string> }
    >(progress, {
      template: ({ spinner }) => `[${spinner}]`,
      dataProviders: {
        spinner: spinnerDataProvider.getProviders().spinner,
      },
    });
    expect(barItem.render()).toEqual('[.  ]');
    expect(barItem.render()).toEqual('[.. ]');
    expect(barItem.render()).toEqual('[...]');
    expect(barItem.render()).toEqual('[...]');
    expect(barItem.render()).toEqual('[.  ]');
  });
});
