import { Eta } from '../eta';

describe('Eta', () => {
  let eta;
  let getTimeSpy;

  beforeEach(() => {
    eta = new Eta();
    getTimeSpy = jest.spyOn(eta, 'getTime');
  });

  it('params deps', () => {

  });

  it('params debounce', () => {

  });

  it('should initialize correctly', () => {
    expect(eta.getSpeed()).toEqual(NaN);
    expect(eta.getDurationMs()).toBe(0);
    expect(eta.getEtaS()).toBe(NaN);
    // expect(eta.getDurationMs()).toBeGreaterThan(0);
  });

  it('should update speed, eta and duration correctly', () => {
    const started = eta.started;
    getTimeSpy
      .mockReturnValue(started + 1000);
    eta.update(10, 100);
    getTimeSpy
      .mockReturnValue(started + 2000);
    eta.update(20, 100);
    expect(eta.getSpeed()).toBe(10);
    expect(eta.getEtaS()).toBe(8);
    expect(eta.getDurationMs(2000));
  });

  it('should correct handle set', () => {
    eta.set(10, 100);
    const started = eta.started;
    getTimeSpy.mockReturnValue(started);
    expect(eta.getSpeed()).toBe(NaN);
    expect(eta.getEtaS()).toBe(NaN);
    expect(eta.getDurationMs(0));

    getTimeSpy.mockReturnValue(started + 1000);
    eta.update(20, 100);
    expect(eta.getSpeed()).toBe(10);
    expect(eta.getEtaS()).toBe(8);
    expect(eta.getDurationMs(1000));
  });

  describe('Edge Cases (total >= count)', () => {
    beforeEach(async () => {
      eta.set(0, 100);
      const started = eta.started;
      getTimeSpy.mockReturnValue(started + 9900);
      eta.update(99, 100);
      expect(eta.getSpeed()).toBe(10);
      expect(eta.getEtaS()).toBe(0);
      expect(eta.getDurationMs(9900));
      getTimeSpy.mockReturnValue(started + 10000);
      eta.update(100, 100);
      getTimeSpy.mockReturnValue(started + 11000);
      expect(eta.getDurationMs()).toBe(10000);
    })

    it('should stop updating duration when total > count', () => {
      const started = eta.started;
      getTimeSpy.mockReturnValue(started + 11000);
      expect(eta.getDurationMs()).toBe(10000);
    });

    it('should update duration if value incremented', () => {
      eta.update(110, 100);
      expect(eta.getDurationMs()).toBe(11000);
      expect(eta.getSpeed()).toBe(NaN);
      expect(eta.getEtaS()).toBe(NaN);
    });

    it('should return NaN for speed', () => {
      eta.update(110, 100);
      expect(eta.getSpeed()).toBe(NaN);
    });

    it('should return NaN for eta if total > count', () => {
      eta.update(110, 100);
      expect(eta.getSpeed()).toBe(NaN);
    });
  });
});
