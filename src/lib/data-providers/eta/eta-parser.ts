export enum ETimePeriodKey {
  days = 'd',
  hours = 'h',
  minutes = 'm',
  seconds = 's',
}

export interface IFormatPayload {
  period: number;
  name: ETimePeriodKey;
  value: number;
}

export const etaParser = (num: number): IFormatPayload[] => {
  if (!Number.isFinite(num)) throw new Error('Invalid number');
  return [
    { period: 3600 * 24, name: ETimePeriodKey.days },
    { period: 3600, name: ETimePeriodKey.hours },
    { period: 60, name: ETimePeriodKey.minutes },
    { period: 1, name: ETimePeriodKey.seconds },
  ]
    .reduce(
      ({ n, result }, { period, name }) => {
        result.push({ period, name, value: Math.floor(n / period) });
        return { n: n % period, result };
      },
      { n: num, result: [] },
    )
    .result.reverse();
};
