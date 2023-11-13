import { Progress, BarDataResult, BarsFormatter } from '../../';

describe('Bars Formatter', () => {
  it('should format bar result', () => {
    const progresses = [
      new Progress({ total: 100 }),
      new Progress({ total: 100 })
    ];
    const result = new BarDataResult([
      {
        str: '=====',
        progress: progresses[0],
      },
      {
        str: '--------',
        progress: progresses[1],
      },
    ]);
    const barsFormatter = new BarsFormatter([
      str => `[${str}]`,
      str => `(${str})`,
    ]);
    const text = barsFormatter.formatter(result, progresses[0], progresses);
    expect(text.toString()).toEqual('[=====](--------)');
  });
  it('should return as is if instance not result', () => {
    const progresses = [
      new Progress({ total: 100 }),
      new Progress({ total: 100 })
    ];
    const result = '=========';
    const barsFormatter = new BarsFormatter([
      str => `[${str}]`,
      str => `(${str})`,
    ]);
    const text = barsFormatter.formatter(
      result as never,
      progresses[0],
      progresses,
    );
    expect(text).toEqual('=========');
  });
});
