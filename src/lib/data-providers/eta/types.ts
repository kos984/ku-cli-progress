import { ETimePeriodKey } from './eta.data-provider';

export interface IFormatPayload {
  period: number;
  name: ETimePeriodKey;
  value: number;
}
