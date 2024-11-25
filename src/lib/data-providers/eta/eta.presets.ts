import { IFormatPayload } from './types';

// 2d07h33m20s
export const etaFormatFunctionSeconds = (
  s: IFormatPayload,
  m: IFormatPayload,
  h: IFormatPayload,
  d: IFormatPayload,
) => {
  return `${d.value * 24 + h.value}:${m.value < 10 ? '0' + m.value : m.value}:${
    s.value < 10 ? '0' + s.value : s.value
  }`;
};

// 2d07h33m20s
export const etaFormatFunctionShort = (...args: IFormatPayload[]): string => {
  const format = (value: number, str: string, forceAdd: boolean) =>
    value || forceAdd
      ? `${value < 10 && forceAdd ? '0' + value : value}${str}`
      : '';
  return (
    args
      .reverse()
      .reduce(
        (str, { value, name }) => str + format(value, name, str.length !== 0),
        '',
      ) || '0s'
  );
};

export const etaFormatFunctionLong = (...args: IFormatPayload[]): string => {
  const map = { s: 'second', d: 'day', h: 'hour', m: 'minute' };
  const format = (value: number, str: string, forceAdd: boolean) =>
    value || forceAdd
      ? `${value} ${str}${value > 1 || value === 0 ? 's' : ''} `
      : '';
  return (
    args
      .reverse()
      .reduce(
        (str, { value, name }) =>
          str + format(value, map[name], str.length !== 0),
        '',
      )
      .trim() || '0 seconds'
  );
};

// 55:33:20
export const etaFormatFunctionTime = (
  s: IFormatPayload,
  m: IFormatPayload,
  h: IFormatPayload,
  d: IFormatPayload,
) => {
  return `${d.value * 24 + h.value}:${m.value < 10 ? '0' + m.value : m.value}:${
    s.value < 10 ? '0' + s.value : s.value
  }`;
};
