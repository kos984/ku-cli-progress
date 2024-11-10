import { IProgress } from '../interfaces/progress.interface';

// FIXME: think about it, it does not looks good idea for me, better to use indexes
const getNextIndex = (
  prop: string,
  indexCounter: Map<string, number>,
  argsLength: number,
) => {
  const index = indexCounter.get(prop) ?? 0;
  indexCounter.set(prop, index + 1 >= argsLength ? 0 : index + 1);
  return index;
};

export function stringTemplate(str: string, tagDelimiter = ':') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (...args: (Record<string, any> & { progress: IProgress })[]) => {
    const indexCounter = new Map<string, number>();
    return str.replace(/{([^{}]+)}/g, (match, prop) => {
      const [property, tag] = prop.split(tagDelimiter).reverse();
      const index = tag
        ? args.findIndex(data => data.progress.getTag() === tag)
        : getNextIndex(property, indexCounter, args.length);
      if (index < 0 || index >= args.length) return match;
      return args?.[index]?.[prop] ?? match;
    });
  };
}

/*
const template = `[{bar}] {percentage} ETA: {eta} speed: {speed} duration: {duration} {value}/{total} 2:{value} 3:{value}`;

const str = stringTemplate(template)({ value: 10 } as any, { value: 29 } as any);
console.log(str);
 */
