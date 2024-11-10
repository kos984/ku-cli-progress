// FIXME: think about folder name, it is not looks great to me, something like bit-item-template???
import { ITemplateFunction } from '../bar-item';

export const defaultTemplate: ITemplateFunction<unknown> = (...args) => {
  const formatNumber = (num: number, suffix: string): string => {
    if (!Number.isFinite(num)) return '\u221E';
    return num + suffix;
  };
  const bars = args.length > 1 ? args[0]?.bars : args[0].bar;
  // [████████████████████████░░░░░░░░░░░░░░░░] 60%/24% ETA: 2s/4s speed: 230/s/188/s duration: 1s/1s 597/1000 244/1000
  const percentage = args
    .map(arg => formatNumber(arg?.percentage, '%'))
    .join('/');
  const eta = args.map(arg => formatNumber(arg?.eta, 's')).join('/');
  const speed = args.map(arg => formatNumber(arg?.speed, '/s')).join('/');
  const duration = args.map(arg => formatNumber(arg?.duration, 's')).join('/');
  const valueOfTotal = args.map(arg => arg?.value + '/' + arg?.total).join(' ');
  return `[${bars}] ${percentage} ETA: ${eta} speed: ${speed} duration: ${duration} ${valueOfTotal}`;
};
