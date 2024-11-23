import {
  EtaDataProvider,
  etaFunctionPresets,
} from '../data-providers/eta/eta.data-provider';
import { Progress } from '../progress';
import { etaFormatFunctionLong } from '../data-providers/eta/eta.presets';

describe('eta.presets', () => {
  it('should be defined', () => {
    expect(etaFunctionPresets).toBeDefined();
  });

  it('default infinitySymbol', () => {
    const etaDataProvider = new EtaDataProvider();
    const progress = new Progress({ total: 100 });
    expect(
      etaDataProvider.getProviders().etaHumanReadable(progress, [progress]),
    ).toEqual('∞');
  });

  it('custom infinitySymbol', () => {
    const etaDataProvider = new EtaDataProvider({
      infinitySymbol: '',
    });
    const progress = new Progress({ total: 100 });
    expect(
      etaDataProvider.getProviders().etaHumanReadable(progress, [progress]),
    ).toEqual('');
  });

  const describeTests = [
    {
      name: 'etaFormatFunctionTime',
      formatFunction: etaFunctionPresets.etaFormatFunctionTime,
    },
    {
      name: 'etaFormatFunctionShort',
      formatFunction: etaFunctionPresets.etaFormatFunctionShort,
    },
    {
      name: 'etaFormatFunctionLong',
      formatFunction: etaFunctionPresets.etaFormatFunctionLong,
    },
  ];
  const tests = [
    {
      eta: 0,
      [etaFunctionPresets.etaFormatFunctionTime.name]: '0:00:00',
      [etaFunctionPresets.etaFormatFunctionShort.name]: '0s',
      [etaFunctionPresets.etaFormatFunctionLong.name]: '0 seconds',
    },
    {
      eta: 200000,
      [etaFunctionPresets.etaFormatFunctionTime.name]: '55:33:20',
      [etaFunctionPresets.etaFormatFunctionShort.name]: '2d07h33m20s',
      [etaFunctionPresets.etaFormatFunctionLong.name]:
        '2 days 7 hours 33 minutes 20 seconds',
    },
    {
      eta: 7200,
      [etaFunctionPresets.etaFormatFunctionTime.name]: '2:00:00',
      [etaFunctionPresets.etaFormatFunctionShort.name]: '2h00m00s',
      [etaFunctionPresets.etaFormatFunctionLong.name]:
        '2 hours 0 minutes 0 seconds',
    },
    {
      eta: 7260,
      [etaFunctionPresets.etaFormatFunctionTime.name]: '2:01:00',
      [etaFunctionPresets.etaFormatFunctionShort.name]: '2h01m00s',
      [etaFunctionPresets.etaFormatFunctionLong.name]:
        '2 hours 1 minute 0 seconds',
    },
  ];

  for (const { name, formatFunction } of describeTests) {
    describe(name, () => {
      const etaDataProvider = new EtaDataProvider({
        formatFunction,
      });
      const progress = new Progress({ total: 100 });
      const eta = progress.getEta();
      for (const test of tests) {
        it(name + ' eta: ' + test.eta, () => {
          jest.spyOn(eta, 'getEtaS').mockReturnValueOnce(test.eta);
          expect(
            etaDataProvider
              .getProviders()
              .etaHumanReadable(progress, [progress]),
          ).toEqual(test[name]);
        });
      }
    });
  }
});
