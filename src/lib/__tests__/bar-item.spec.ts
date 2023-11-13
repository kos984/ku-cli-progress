import { BarItem, Eta, presets, Progress } from '../../';
import { IEta } from '../interfaces/eta.interface';
import { BarsFormatter } from '../formaters/bars-formatter';

describe('Progress Bar Lib', () => {
  it('should construct with progress or array of progresses', () => {
    const progress = new Progress({ total: 100 });
    const barItem = new BarItem(progress);
    const barItem2 = new BarItem([progress]);
    expect(barItem.getProgresses()).toEqual(barItem2.getProgresses());
  });

  describe('single bar', () => {
    it('render', () => {
      const eta: IEta = {
        update: jest.fn(),
        set: jest.fn(() => eta),
        getEtaS: jest.fn(() => 9),
        getSpeed: jest.fn(() => 10),
        getDurationMs: jest.fn(() => 1000),
      };
      const progress = new Progress({ total: 100, eta });
      const barItem = new BarItem(progress);
      expect(barItem.render()).toEqual(
        '[----------------------------------------] 0% ETA: 9s speed: 10/s duration: 1s 0/100',
      );
    });

    it('should return match if tag not exists', () => {
      const progress = new Progress({ total: 100, tag: 'tag' }, { foo: 'bar' });
      const barItem = new BarItem(progress, {
        template: '[{bar}] {tag1_foo}',
      });
      expect(barItem.render()).toEqual(
        '[----------------------------------------] {tag1_foo}',
      );
    });

    it('should replace data from payload', () => {
      const progress = new Progress({ total: 100 }, { foo: 'bar' });
      const barItem = new BarItem(progress, {
        template: '[{bar}] {foo}',
      });
      expect(barItem.render()).toEqual(
        '[----------------------------------------] bar',
      );
    });
    it('should replace data from payload (override default data)', () => {
      const progress = new Progress(
        { total: 100 },
        { speed: '[speed override]' },
      );
      const barItem = new BarItem(progress, {
        template: '[{bar}] {speed}',
      });
      expect(barItem.render()).toEqual(
        '[----------------------------------------] [speed override]',
      );
    });
    it('should NOT replace data if not found any from defined & payload', () => {
      const progress = new Progress({ total: 100 });
      const barItem = new BarItem(progress, {
        template: '[{bar}] {foo}',
      });
      expect(barItem.render()).toEqual(
        '[----------------------------------------] {foo}',
      );
    });
    it('formatters', () => {
      const progress = new Progress({ total: 100 });
      progress.increment(20);
      const barItem = new BarItem(progress, {
        template: '[{bar}] {value}',
        formatters: {
          value: str => 'done: ' + str,
        },
      });
      expect(barItem.render()).toEqual(
        '[========--------------------------------] done: 20',
      );
    });
  });

  describe('eta formatEtaHumanReadable', () => {
    it('should return human readable ETA', () => {
      const eta = new Eta();
      const spy = jest.spyOn(eta, 'getEtaS').mockReturnValue(1000000);
      const progress = new Progress({ total: 100, tag: 'tag', eta });
      const barItem = new BarItem(progress, {
        template: ({ bar, etaHumanReadable }) =>
          `[${bar['tag']}] ${etaHumanReadable}`,
      });
      expect(barItem.render()).toEqual(
        '[----------------------------------------] 11d13h46m40s',
      );
    });
    it('should return human readable ETA 0s', () => {
      const eta = new Eta();
      const spy = jest.spyOn(eta, 'getEtaS').mockReturnValue(0);
      const progress = new Progress({ total: 100, tag: 'tag', eta });
      const barItem = new BarItem(progress, {
        template: ({ bar, etaHumanReadable }) =>
          `[${bar['tag']}] ${etaHumanReadable}`,
      });
      expect(barItem.render()).toEqual(
        '[----------------------------------------] 0s',
      );
    });
  });

  describe('template function', () => {
    it('should return match if tag not exists', () => {
      const progress = new Progress({ total: 100, tag: 'tag' }, { foo: 'bar' });
      const barItem = new BarItem(progress, {
        template: ({ bar, foo }) =>
          `[${bar['tag']}] ${foo['wrong_tag']}`,
      });
      expect(barItem.render()).toEqual(
        '[----------------------------------------] undefined',
      );
    });
    it('should return match if tag exists', () => {
      const progress = new Progress({ total: 100, tag: 'tag' }, { foo: 'bar' });
      const barItem = new BarItem(progress, {
        template: ({ bar, foo }) =>
          `[${bar['tag']}] ${foo['tag']}`,
      });
      expect(barItem.render()).toEqual(
        '[----------------------------------------] bar',
      );
    });
    it('should return match by index', () => {
      const progress = new Progress({ total: 100, tag: 'tag' }, { foo: 'bar' });
      const barItem = new BarItem(progress, {
        template: ({ bar, foo }) =>
          `[${bar['tag']}] ${foo[0]}`,
      });
      expect(barItem.render()).toEqual(
        '[----------------------------------------] bar',
      );
    });
    it('should return match by index', () => {
      const progress = new Progress({ total: 100, tag: 'tag' }, { foo: 'bar' });
      const barItem = new BarItem(progress, {
        template: ({ bar, foo }) => `[${bar['tag']}] ${foo[100]}`,
      });
      expect(barItem.render()).toEqual(
        '[----------------------------------------] {foo}',
      );
    });
    it('should support function template', () => {
      const progress1 = new Progress({ total: 100 });
      const progress2 = new Progress({ total: 100 });
      const progress3 = new Progress({ total: 100 });

      progress1.increment(30);
      progress3.increment(70);

      const barItem = new BarItem([progress1, progress2, progress3], {
        template: ({ bar, value, total, eta }) => {
          const etaString = JSON.stringify(eta);
          return `
            [${bar}] ${value}/${total} eta: ${etaString}
            [${bar}] ${value}/${total} eta: ${etaString}
            [${bar}] ${value}/${total} eta: ${etaString}
            [${bar}] ${value}/${total} eta: ${etaString} // again first
          `.trim();
        },
      });
      expect(barItem.render()).toEqual(
        `
            [============----------------------------] 30/100 eta: "[generated value for: [eta] data provider]"
            [----------------------------------------] 0/100 eta: "[generated value for: [eta] data provider]"
            [============================------------] 70/100 eta: "[generated value for: [eta] data provider]"
            [============----------------------------] 30/100 eta: "[generated value for: [eta] data provider]" // again first
        `.trim(),
      );
    });
    it('should throw error if data provider not exists', () => {
      const progress = new Progress({ total: 100 });

      const symbol = Symbol('mock for system symbols');
      const barItem = new BarItem([progress], {
        dataProviders: { [symbol as any]: () => 'test' },
        template: data => {
          expect(data[symbol as any]).toBeUndefined();
          return `${(data as any).notExistsProperty}`.trim();
        },
      });
      expect(barItem.render()).toEqual('{notExistsProperty}');
      expect(() => barItem.render()).not.toThrowError(
        'unknown data provider: notExistsProperty',
      );
    });
  });

  describe('multicolor bar', () => {
    it('simple render', () => {
      const progress1 = new Progress({ total: 100 });
      const progress2 = new Progress({ total: 100 });
      const progress3 = new Progress({ total: 100 });

      progress1.increment(30);
      progress3.increment(70);

      const barItem = new BarItem([progress1, progress2, progress3]);
      expect(barItem.render()).toEqual(
        '[============================------------] 30%/0%/70% ETA: ∞/∞/∞ speed: 0/s/0/s/0/s duration: 0s/0s/0s 30/100 0/100 70/100',
      );
    });

    it('render with different complete chars', () => {
      const progress1 = new Progress({ total: 100 });
      const progress2 = new Progress({ total: 100 });
      const progress3 = new Progress({ total: 100 });

      progress1.increment(30);
      progress3.increment(70);
      const progresses = [progress1, progress2, progress3];

      const barItem = new BarItem(progresses, {
        formatters: {
          bars: new BarsFormatter(
            ['#', '=', '+'].map(char => str => char.repeat(str.length)),
          ),
        },
      });
      expect(barItem.render()).toEqual(
        '[############++++++++++++++++------------] 30%/0%/70% ETA: ∞/∞/∞ speed: 0/s/0/s/0/s duration: 0s/0s/0s 30/100 0/100 70/100',
      );
    });

    it('should replace property from the beginning', () => {
      const progress1 = new Progress({ total: 100 });
      const progress2 = new Progress({ total: 100 });

      progress1.increment(30);
      progress2.increment(70);

      const barItem = new BarItem([progress1, progress2], {
        template: '[{bars}] {speed}/{speed}/{speed}',
        formatters: {
          bars: new BarsFormatter(
            ['#', '=', '+'].map(char => str => char.repeat(str.length)),
          ),
        },
      });
      expect(barItem.render()).toEqual(
        '[############================------------] 0/s/0/s/0/s',
      );
    });
    it('tags', () => {
      const progress1 = new Progress({ total: 100, tag: 'p1' });
      const progress2 = new Progress({ total: 100, tag: 'p2' });

      progress1.increment(30);
      progress2.increment(70);

      const barItem = new BarItem([progress1, progress2], {
        template: '[{bars}] value 1: {p1_value}; value 2: {p2_value}',
        formatters: {
          bars: new BarsFormatter(
            ['#', '=', '+'].map(char => str => char.repeat(str.length)),
          ),
        },
      });
      expect(barItem.render()).toEqual(
        '[############================------------] value 1: 30; value 2: 70',
      );
    });

    it('should correct render composite bar', () => {
      const progress1 = new Progress({ total: 100, tag: 'p1' });
      const progress2 = new Progress({ total: 100, start: 30, tag: 'p2' });

      const barItem = new BarItem([progress1, progress2], {
        template: '[{bars}]',
        formatters: {
          bars: new BarsFormatter(
            ['#', '=', '+'].map(char => str => char.repeat(str.length)),
          ),
        },
      });
      const results = [];
      results.push(barItem.render());
      for (let i = 0; i < 15; i++) {
        progress1.increment();
        progress2.increment();
        results.push(barItem.render());
      }
      expect(results).toEqual([
        '[============----------------------------]',
        '[============----------------------------]',
        '[#============---------------------------]',
        '[#============---------------------------]',
        '[##============--------------------------]',
        '[##============--------------------------]',
        '[##============--------------------------]',
        '[###============-------------------------]',
        '[###============-------------------------]',
        '[####============------------------------]',
        '[####============------------------------]',
        '[####============------------------------]',
        '[#####============-----------------------]',
        '[#####============-----------------------]',
        '[######============----------------------]',
        '[######============----------------------]',
      ]);
    });
  });

  describe('braille', () => {
    it('should render single braille', () => {
      const progress = new Progress({ total: 300 });

      const barItem = new BarItem(progress, {
        options: presets.braille,
        template: '[{bar}]',
      });
      const results = [];
      results.push(barItem.render());
      for (let i = 0; i < 15; i++) {
        progress.increment();
        results.push(barItem.render());
      }
      expect(results).toEqual([
        '[⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀]',
        '[⣤⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀]',
        '[⣤⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀]',
        '[⣦⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀]',
        '[⣶⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀]',
        '[⣶⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀]',
        '[⣷⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀]',
        '[⣿⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀]',
        '[⣿⣄⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀]',
        '[⣿⣤⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀]',
        '[⣿⣦⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀]',
        '[⣿⣦⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀]',
        '[⣿⣶⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀]',
        '[⣿⣷⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀]',
        '[⣿⣷⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀]',
        '[⣿⣿⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀]',
      ]);
    });

    it('should render composite braille', () => {
      const progress1 = new Progress({ total: 300 });
      const progress2 = new Progress({ total: 300, start: 30 });

      const barItem = new BarItem([progress1, progress2], {
        options: presets.braille,
        template: '[{bars}]',
        formatters: {
          // FIXME: update READMI
          bars: new BarsFormatter([
            (s: string) => `yellow${s}clearYellow`,
            (s: string) => `blue${s}clearBlue`,
          ]),
        },
      });
      const results = [];
      results.push(barItem.render());
      for (let i = 0; i < 15; i++) {
        progress1.increment();
        progress2.increment();
        results.push(barItem.render());
      }
      expect(results).toEqual([
        '[blue⣿⣿⣿⣿clearBlue⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀]',
        '[blue⣿⣿⣿⣿⣤clearBlue⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀]',
        '[blue⣿⣿⣿⣿⣤clearBlue⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀]',
        '[blue⣿⣿⣿⣿⣦clearBlue⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀]',
        '[yellow⣶clearYellowblue⣿⣿⣿⣶clearBlue⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀]',
        '[yellow⣶clearYellowblue⣿⣿⣿⣶clearBlue⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀]',
        '[yellow⣷clearYellowblue⣿⣿⣿⣷clearBlue⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀]',
        '[yellow⣿clearYellowblue⣿⣿⣿⣿clearBlue⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀]',
        '[yellow⣿clearYellowblue⣿⣿⣿⣿⣄clearBlue⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀]',
        '[yellow⣿clearYellowblue⣿⣿⣿⣿⣤clearBlue⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀]',
        '[yellow⣿clearYellowblue⣿⣿⣿⣿⣦clearBlue⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀]',
        '[yellow⣿clearYellowblue⣿⣿⣿⣿⣦clearBlue⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀]',
        '[yellow⣿⣶clearYellowblue⣿⣿⣿⣶clearBlue⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀]',
        '[yellow⣿⣷clearYellowblue⣿⣿⣿⣷clearBlue⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀]',
        '[yellow⣿⣷clearYellowblue⣿⣿⣿⣷clearBlue⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀]',
        '[yellow⣿⣿clearYellowblue⣿⣿⣿⣿clearBlue⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀]',
      ]);
    });
    it('human readable eta', () => {
      const eta = new Eta();
      const getEtaS = jest.spyOn(eta, 'getEtaS');
      getEtaS.mockReturnValue(1e1 as never);
      const progress = new Progress({ total: 1e6, eta });
      const barItem = new BarItem(progress, {
        template: '{eta} {etaHumanReadable}',
      });
      expect(barItem.render()).toEqual('10s 10s');
      getEtaS.mockReturnValue(1e2 as never);
      expect(barItem.render()).toEqual('100s 1m40s');
      getEtaS.mockReturnValue(1e3 as never);
      expect(barItem.render()).toEqual('1000s 16m40s');
      getEtaS.mockReturnValue(1e4 as never);
      expect(barItem.render()).toEqual('10000s 2h46m40s');
      getEtaS.mockReturnValue(1e5 as never);
      expect(barItem.render()).toEqual('100000s 1d3h46m40s');
      getEtaS.mockReturnValue(1e6 as never);
      expect(barItem.render()).toEqual('1000000s 11d13h46m40s');
      getEtaS.mockReturnValue(NaN as never);
      expect(barItem.render()).toEqual('∞ ∞');
    });
  });
});
