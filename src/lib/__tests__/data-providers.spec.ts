import { DataProviders } from '../data-providers/data-providers';
import { Progress } from '../progress';

describe('data-providers', () => {
  it('should be defined', () => {
    expect(DataProviders).toBeDefined();
  });

  it('custom data provider should be optional', () => {
    const progress = new Progress({ total: 100 });
    const dataProvider = new DataProviders({
      progress,
      progresses: [progress],
    });
    expect(dataProvider.value).toBe(0);
    expect(dataProvider.total).toBe(100);
    expect(dataProvider.percentage).toBe(0);
    expect(dataProvider.eta).toBe(Infinity);
    expect(dataProvider.speed).toBe(0);
    expect(dataProvider.duration).toBe(0);
    expect(dataProvider.progress).toBe(progress);
    expect(dataProvider.progresses).toEqual([progress]);
  });
});
