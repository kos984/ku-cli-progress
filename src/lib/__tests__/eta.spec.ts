import { Eta } from '../../';

jest.mock('../time');
import { getTime } from '../time';
const getTimeMock = getTime as jest.Mock;

describe('Eta', () => {
  let eta;

  beforeEach(() => {
    eta = new Eta();
    getTimeMock.mockReturnValue(0);
  });

  it('should initialize correctly', () => {
    expect(eta.getSpeed()).toEqual(0);
    expect(eta.getDurationMs()).toEqual(expect.any(Number));
    expect(eta.getEtaS()).toBe(Infinity);
    eta.update(1, 100);
    expect(eta.getEtaS()).toBe(Infinity);
  });

  it('should update speed, eta and duration correctly', () => {
    const started = eta.started;
    getTimeMock.mockReturnValue(started + 1000);
    eta.update(10, 100);
    getTimeMock.mockReturnValue(started + 2000);
    eta.update(20, 100);
    expect(eta.getSpeed()).toBe(10);
    expect(eta.getEtaS()).toBe(8);
    expect(eta.getDurationMs(2000));
  });

  it('should correct handle set', () => {
    eta.set(10);
    const started = eta.started;
    getTimeMock.mockReturnValue(started);
    expect(eta.getSpeed()).toBe(0);
    expect(eta.getEtaS()).toBe(Infinity);
    expect(eta.getDurationMs(0));

    getTimeMock.mockReturnValue(started + 1000);
    eta.update(20, 100);
    expect(eta.getSpeed()).toBe(10);
    expect(eta.getEtaS()).toBe(8);
    expect(eta.getDurationMs(1000));
  });

  describe('should count speed based on speedMoments, deps, debounce', () => {
    const eta = new Eta({ deps: 3, debounce: 0.01 });
    const etaDebounce = new Eta({ deps: 3, debounce: 0.1 });
    const etaDeps = new Eta({ deps: 5, debounce: 0.01 });
    const etas = [eta, etaDebounce, etaDeps];

    it('init', () => {
      getTimeMock.mockReturnValue(0);
      etas.forEach(eta => eta.set(0));
      expect(etas.map(eta => eta.getSpeed())).toEqual([0, 0, 0]);
      expect(etas.map(eta => eta.getEtaS())).toEqual([
        Infinity,
        Infinity,
        Infinity,
      ]);
      expect(etas.map(eta => eta.getDurationMs())).toEqual([0, 0, 0]);
    });

    it('duration 1000, increment 10', () => {
      getTimeMock.mockReturnValue(1000);
      etas.forEach(eta => eta.update(10, 1000));
      expect(etas.map(eta => eta.getSpeed())).toEqual([10, 10, 10]);
      expect(etas.map(eta => eta.getEtaS())).toEqual([99, 99, 99]);
      expect(etas.map(eta => eta.getDurationMs())).toEqual([1000, 1000, 1000]);
    });

    it('duration 1800, increment 10', () => {
      getTimeMock.mockReturnValue(1800);
      etas.forEach(eta => eta.update(20, 1000));
      expect(etas.map(eta => eta.getSpeed())).toEqual([
        11.428571428571429, 11.428571428571429, 11.363636363636363,
      ]);
      expect(etas.map(eta => eta.getEtaS())).toEqual([86, 86, 86]);
      expect(etas.map(eta => eta.getDurationMs())).toEqual([1800, 1800, 1800]);
    });

    it('duration 2500, increment 10', () => {
      getTimeMock.mockReturnValue(2500);
      etas.forEach(eta => eta.update(30, 1000));
      expect(etas.map(eta => eta.getSpeed())).toEqual([
        12.61904761904762, 12.61904761904762, 12.5,
      ]);
      expect(etas.map(eta => eta.getEtaS())).toEqual([77, 77, 78]);
      expect(etas.map(eta => eta.getDurationMs())).toEqual([2500, 2500, 2500]);
    });

    it('duration 2800, increment 10', () => {
      getTimeMock.mockReturnValue(2800);
      etas.forEach(eta => eta.update(40, 1000));
      expect(etas.map(eta => eta.getSpeed())).toEqual([
        21.775793650793656, 21.775793650793656, 18.910256410256412,
      ]);
      expect(etas.map(eta => eta.getEtaS())).toEqual([44, 44, 51]);
      expect(etas.map(eta => eta.getDurationMs())).toEqual([2800, 2800, 2800]);
    });

    it('duration 3100, increment 10', () => {
      getTimeMock.mockReturnValue(3100);
      etas.forEach(eta => eta.update(50, 1000));
      expect(etas.map(eta => eta.getSpeed())).toEqual([
        28.571428571428573, 28.571428571428573, 22.61904761904762,
      ]);
      expect(etas.map(eta => eta.getEtaS())).toEqual([33, 33, 42]);
      expect(etas.map(eta => eta.getDurationMs())).toEqual([3100, 3100, 3100]);
    });

    it('duration 3400, increment 10', () => {
      getTimeMock.mockReturnValue(3400);
      etas.forEach(eta => eta.update(60, 1000));
      expect(etas.map(eta => eta.getSpeed())).toEqual([
        33.333333333333336, 33.333333333333336, 27.09183673469388,
      ]);
      expect(etas.map(eta => eta.getEtaS())).toEqual([28, 28, 35]);
      expect(etas.map(eta => eta.getDurationMs())).toEqual([3400, 3400, 3400]);
    });

    it('duration 3750, increment 10', () => {
      getTimeMock.mockReturnValue(3750);
      etas.forEach(eta => eta.update(70, 1000));
      expect(etas.map(eta => eta.getSpeed())).toEqual([
        31.34920634920635, 33.333333333333336, 29.387755102040817,
      ]);
      expect(etas.map(eta => eta.getEtaS())).toEqual([30, 28, 32]);
      expect(etas.map(eta => eta.getDurationMs())).toEqual([3750, 3750, 3750]);
    });

    it('duration 5100, increment 10', () => {
      getTimeMock.mockReturnValue(5100);
      etas.forEach(eta => eta.update(80, 1000));
      expect(etas.map(eta => eta.getSpeed())).toEqual([
        20.943562610229282, 20.943562610229282, 25.57823129251701,
      ]);
      expect(etas.map(eta => eta.getEtaS())).toEqual([44, 44, 36]);
      expect(etas.map(eta => eta.getDurationMs())).toEqual([5100, 5100, 5100]);
    });
  });

  describe('Edge Cases (total >= count)', () => {
    beforeEach(async () => {
      eta.set(0);
      const started = eta.started;
      getTimeMock.mockReturnValue(started + 9900);
      eta.update(99, 100);
      expect(eta.getSpeed()).toBe(10);
      expect(eta.getEtaS()).toBe(0);
      expect(eta.getDurationMs(9900));
      getTimeMock.mockReturnValue(started + 10000);
      eta.update(100, 100);
      getTimeMock.mockReturnValue(started + 11000);
      expect(eta.getDurationMs()).toBe(10000);
    });

    it('should stop updating duration when total > count', () => {
      const started = eta.started;
      getTimeMock.mockReturnValue(started + 11000);
      expect(eta.getDurationMs()).toBe(10000);
    });

    it('should update duration if value incremented', () => {
      eta.update(110, 100);
      expect(eta.getDurationMs()).toBe(11000);
      expect(eta.getSpeed()).toBe(0);
      expect(eta.getEtaS()).toBe(0);
    });

    it('should return 0 for speed', () => {
      eta.update(110, 100);
      expect(eta.getSpeed()).toBe(0);
    });

    it('should return 0 for eta if total > count', () => {
      eta.update(110, 100);
      expect(eta.getSpeed()).toBe(0);
    });
  });
});
