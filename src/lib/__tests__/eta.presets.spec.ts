import { EtaDataProvider } from '../data-providers/eta/eta.data-provider';
import { Progress } from '../progress';
const etaFunctionPresets = EtaDataProvider.presets;
import {
  etaFormatFunctionLong,
  etaFormatFunctionShort,
  etaFormatFunctionTime,
  etaFormatFunctionSimple,
} from '../data-providers/eta/eta.presets';

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

  describe('individual eta format functions', () => {
    describe('etaFormatFunctionSimple', () => {
      it('should format simple values', () => {
        expect(etaFormatFunctionSimple(0)).toBe('0s');
        expect(etaFormatFunctionSimple(60)).toBe('60s');
        expect(etaFormatFunctionSimple(3661)).toBe('3661s');
      });
    });

    describe('etaFormatFunctionShort', () => {
      it('should format short values correctly', () => {
        expect(etaFormatFunctionShort(0)).toBe('0s');
        expect(etaFormatFunctionShort(61)).toBe('1m01s');
        expect(etaFormatFunctionShort(3661)).toBe('1h01m01s');
        expect(etaFormatFunctionShort(90061)).toBe('1d01h01m01s');
        expect(etaFormatFunctionShort(3600)).toBe('1h00m00s');
        expect(etaFormatFunctionShort(60)).toBe('1m00s');
      });

      it('should handle edge cases', () => {
        expect(etaFormatFunctionShort(1)).toBe('1s');
        expect(etaFormatFunctionShort(59)).toBe('59s');
        expect(etaFormatFunctionShort(3601)).toBe('1h00m01s');
      });
    });

    describe('etaFormatFunctionLong', () => {
      it('should format long values correctly', () => {
        expect(etaFormatFunctionLong(0)).toBe('0 seconds');
        expect(etaFormatFunctionLong(1)).toBe('1 second');
        expect(etaFormatFunctionLong(2)).toBe('2 seconds');
        expect(etaFormatFunctionLong(61)).toBe('1 minute 1 second');
        expect(etaFormatFunctionLong(3661)).toBe('1 hour 1 minute 1 second');
        expect(etaFormatFunctionLong(90061)).toBe(
          '1 day 1 hour 1 minute 1 second',
        );
        expect(etaFormatFunctionLong(3600)).toBe('1 hour 0 minutes 0 seconds');
        expect(etaFormatFunctionLong(60)).toBe('1 minute 0 seconds');
      });

      it('should handle pluralization correctly', () => {
        expect(etaFormatFunctionLong(0)).toBe('0 seconds');
        expect(etaFormatFunctionLong(1)).toBe('1 second');
        expect(etaFormatFunctionLong(2)).toBe('2 seconds');
        expect(etaFormatFunctionLong(60)).toBe('1 minute 0 seconds');
        expect(etaFormatFunctionLong(120)).toBe('2 minutes 0 seconds');
        expect(etaFormatFunctionLong(3600)).toBe('1 hour 0 minutes 0 seconds');
        expect(etaFormatFunctionLong(7200)).toBe('2 hours 0 minutes 0 seconds');
      });
    });

    describe('etaFormatFunctionTime', () => {
      it('should format time values correctly', () => {
        expect(etaFormatFunctionTime(0)).toBe('0:00:00');
        expect(etaFormatFunctionTime(1)).toBe('0:00:01');
        expect(etaFormatFunctionTime(61)).toBe('0:01:01');
        expect(etaFormatFunctionTime(3661)).toBe('1:01:01');
        expect(etaFormatFunctionTime(90061)).toBe('25:01:01');
        expect(etaFormatFunctionTime(3600)).toBe('1:00:00');
        expect(etaFormatFunctionTime(60)).toBe('0:01:00');
      });

      it('should handle zero padding correctly', () => {
        expect(etaFormatFunctionTime(0)).toBe('0:00:00');
        expect(etaFormatFunctionTime(1)).toBe('0:00:01');
        expect(etaFormatFunctionTime(10)).toBe('0:00:10');
        expect(etaFormatFunctionTime(60)).toBe('0:01:00');
        expect(etaFormatFunctionTime(70)).toBe('0:01:10');
        expect(etaFormatFunctionTime(600)).toBe('0:10:00');
        expect(etaFormatFunctionTime(610)).toBe('0:10:10');
        expect(etaFormatFunctionTime(3600)).toBe('1:00:00');
        expect(etaFormatFunctionTime(3610)).toBe('1:00:10');
        expect(etaFormatFunctionTime(3660)).toBe('1:01:00');
      });
    });
  });
});
