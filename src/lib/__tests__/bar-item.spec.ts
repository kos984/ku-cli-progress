import { BarItem, presets, Progress } from '../../';
import { IEta } from '../interfaces/eta.interface';
import * as chalk from 'chalk';

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

  describe('multicolor bar', () => {
    it('simple render', () => {
      const progress1 = new Progress({ total: 100 });
      const progress2 = new Progress({ total: 100 });
      const progress3 = new Progress({ total: 100 });

      progress1.increment(30);
      progress3.increment(70);

      const barItem = new BarItem([progress1, progress2, progress3]);
      expect(barItem.render()).toEqual(
        '[============================------------] 30%/0%/70% ETA: NaN/NaN/NaN speed: NaN/NaN/NaN duration: 0s/0s/0s 30/100 0/100 70/100',
      );
    });

    it('render with different complete chars', () => {
      const progress1 = new Progress({ total: 100 });
      const progress2 = new Progress({ total: 100 });
      const progress3 = new Progress({ total: 100 });

      progress1.increment(30);
      progress3.increment(70);

      const barItem = new BarItem([progress1, progress2, progress3], {
        formatters: {
          bar: (str, progress, progresses) => {
            const index = progresses.findIndex(p => p === progress);
            const colors = ['#', '=', '+'];
            return colors[index].repeat(str.length);
          },
        },
      });
      expect(barItem.render()).toEqual(
        '[############++++++++++++++++------------] 30%/0%/70% ETA: NaN/NaN/NaN speed: NaN/NaN/NaN duration: 0s/0s/0s 30/100 0/100 70/100',
      );
    });

    it('should not replace property if process not found', () => {
      const progress1 = new Progress({ total: 100 });
      const progress2 = new Progress({ total: 100 });

      progress1.increment(30);
      progress2.increment(70);

      const barItem = new BarItem([progress1, progress2], {
        template: '[{bars}] {speed}/{speed}/{speed}',
        formatters: {
          bar: (str, progress, progresses) => {
            const index = progresses.findIndex(p => p === progress);
            const colors = ['#', '=', '+'];
            return colors[index].repeat(str.length);
          },
        },
      });
      expect(barItem.render()).toEqual(
        '[############================------------] NaN/NaN/{speed}',
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
          bar: (str, progress, progresses) => {
            const index = progresses.findIndex(p => p === progress);
            const colors = ['#', '=', '+'];
            return colors[index].repeat(str.length);
          },
        },
      });
      expect(barItem.render()).toEqual(
        '[############================------------] value 1: 30; value 2: 70',
      );
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
          bar: (str, progress, progresses) => {
            const colors = [chalk.yellowBright, chalk.blueBright];
            const index = progresses.findIndex(p => p === progress);
            return (colors[index] || chalk.yellow)(str);
          },
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
        '[\u001b[94m⣿⣿⣿⣿\u001b[39m⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀]',
        '[\u001b[94m⣿⣿⣿⣿⣤\u001b[39m⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀]',
        '[\u001b[94m⣿⣿⣿⣿⣤\u001b[39m⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀]',
        '[\u001b[94m⣿⣿⣿⣿⣦\u001b[39m⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀]',
        '[\u001b[93m⣶\u001b[39m\u001b[94m⣿⣿⣿⣶\u001b[39m⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀]',
        '[\u001b[93m⣶\u001b[39m\u001b[94m⣿⣿⣿⣶\u001b[39m⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀]',
        '[\u001b[93m⣷\u001b[39m\u001b[94m⣿⣿⣿⣷\u001b[39m⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀]',
        '[\u001b[93m⣿\u001b[39m\u001b[94m⣿⣿⣿⣿\u001b[39m⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀]',
        '[\u001b[93m⣿\u001b[39m\u001b[94m⣿⣿⣿⣿⣄\u001b[39m⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀]',
        '[\u001b[93m⣿\u001b[39m\u001b[94m⣿⣿⣿⣿⣤\u001b[39m⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀]',
        '[\u001b[93m⣿\u001b[39m\u001b[94m⣿⣿⣿⣿⣦\u001b[39m⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀]',
        '[\u001b[93m⣿\u001b[39m\u001b[94m⣿⣿⣿⣿⣦\u001b[39m⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀]',
        '[\u001b[93m⣿⣶\u001b[39m\u001b[94m⣿⣿⣿⣶\u001b[39m⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀]',
        '[\u001b[93m⣿⣷\u001b[39m\u001b[94m⣿⣿⣿⣷\u001b[39m⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀]',
        '[\u001b[93m⣿⣷\u001b[39m\u001b[94m⣿⣿⣿⣷\u001b[39m⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀]',
        '[\u001b[93m⣿⣿\u001b[39m\u001b[94m⣿⣿⣿⣿\u001b[39m⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀]',
      ]);
    });
  });
});
