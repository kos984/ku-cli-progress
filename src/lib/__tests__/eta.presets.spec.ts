import { EtaDataProvider } from '../data-providers/eta/eta.data-provider';
import { Progress } from '../progress';
const etaFunctionPresets = EtaDataProvider.presets;
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
      formatFunction: etaFunctionPresets.time,
    },
    {
      name: 'etaFormatFunctionShort',
      formatFunction: etaFunctionPresets.short,
    },
    {
      name: 'etaFormatFunctionLong',
      formatFunction: etaFunctionPresets.long,
    },
  ];
  const tests = [
    {
      eta: 0,
      [etaFunctionPresets.time.name]: '0:00:00',
      [etaFunctionPresets.short.name]: '0s',
      [etaFunctionPresets.long.name]: '0 seconds',
    },
    {
      eta: 200000,
      [etaFunctionPresets.time.name]: '55:33:20',
      [etaFunctionPresets.short.name]: '2d07h33m20s',
      [etaFunctionPresets.long.name]: '2 days 7 hours 33 minutes 20 seconds',
    },
    {
      eta: 7200,
      [etaFunctionPresets.time.name]: '2:00:00',
      [etaFunctionPresets.short.name]: '2h00m00s',
      [etaFunctionPresets.long.name]: '2 hours 0 minutes 0 seconds',
    },
    {
      eta: 7260,
      [etaFunctionPresets.time.name]: '2:01:00',
      [etaFunctionPresets.short.name]: '2h01m00s',
      [etaFunctionPresets.long.name]: '2 hours 1 minute 0 seconds',
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
