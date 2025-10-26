import { etaParser, ETimePeriodKey } from '../data-providers/eta/eta-parser';

describe('etaParser', () => {
  it('should parse valid numbers correctly', () => {
    const result = etaParser(3661); // 1 hour, 1 minute, 1 second
    expect(result).toEqual([
      { period: 1, name: ETimePeriodKey.seconds, value: 1 },
      { period: 60, name: ETimePeriodKey.minutes, value: 1 },
      { period: 3600, name: ETimePeriodKey.hours, value: 1 },
      { period: 86400, name: ETimePeriodKey.days, value: 0 },
    ]);
  });

  it('should parse zero correctly', () => {
    const result = etaParser(0);
    expect(result).toEqual([
      { period: 1, name: ETimePeriodKey.seconds, value: 0 },
      { period: 60, name: ETimePeriodKey.minutes, value: 0 },
      { period: 3600, name: ETimePeriodKey.hours, value: 0 },
      { period: 86400, name: ETimePeriodKey.days, value: 0 },
    ]);
  });

  it('should parse large numbers correctly', () => {
    const result = etaParser(90061); // 1 day, 1 hour, 1 minute, 1 second
    expect(result).toEqual([
      { period: 1, name: ETimePeriodKey.seconds, value: 1 },
      { period: 60, name: ETimePeriodKey.minutes, value: 1 },
      { period: 3600, name: ETimePeriodKey.hours, value: 1 },
      { period: 86400, name: ETimePeriodKey.days, value: 1 },
    ]);
  });

  it('should throw error for invalid numbers', () => {
    expect(() => etaParser(Infinity)).toThrow('Invalid number');
    expect(() => etaParser(-Infinity)).toThrow('Invalid number');
    expect(() => etaParser(NaN)).toThrow('Invalid number');
  });

  it('should handle decimal numbers', () => {
    const result = etaParser(3661.5);
    expect(result).toEqual([
      { period: 1, name: ETimePeriodKey.seconds, value: 1 },
      { period: 60, name: ETimePeriodKey.minutes, value: 1 },
      { period: 3600, name: ETimePeriodKey.hours, value: 1 },
      { period: 86400, name: ETimePeriodKey.days, value: 0 },
    ]);
  });
});
