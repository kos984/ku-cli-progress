import { IFormatPayload } from './eta.data-provider';

export const etaFormatFunctionShort = (...args: IFormatPayload[]): string => {
  const format = (value: number, str: string, forceAdd: boolean = false) =>
    value || forceAdd ? `${value}${str}` : '';
  return args
    .reverse()
    .reduce(
      (str, { value, name }) => str + format(value, name, str.length !== 0),
      '',
    );
};

export const etaFormatFunctionLong = (...args: IFormatPayload[]): string => {
  const map = { s: 'second', d: 'day', h: 'hours', m: 'minute' };
  const format = (value: number, str: string, forceAdd: boolean) =>
    value || forceAdd ? `${value} ${str}${value > 1 ? 's' : ''} ` : '';
  return args
    .reverse()
    .reduce(
      (str, { value, name }) =>
        str + format(value, map[name], str.length !== 0),
      '',
    );
};

export const etaFormatFunctionTime = (
  s: IFormatPayload,
  m: IFormatPayload,
  h: IFormatPayload,
  d: IFormatPayload,
) => {
  return `${d.value * 24 + h.value}:${m.value}:${s.value}`;
};
