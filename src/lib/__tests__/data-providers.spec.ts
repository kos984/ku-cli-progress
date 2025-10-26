import { DataProviders } from '../data-providers/data-providers';
import { Progress } from '../progress';

describe('data-providers', () => {
  it('should be defined', () => {
    expect(DataProviders).toBeDefined();
  });

  it('custom data provider should be optional', () => {
    const progress = new Progress({ total: 100 });
    const dataProvider = DataProviders.build({
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

  it('should handle custom data providers', () => {
    const progress = new Progress({ total: 100 });
    const customDataProviders = [
      {
        customValue: {
          getData: jest.fn().mockReturnValue('custom'),
        },
      },
    ];
    const dataProvider = DataProviders.build({
      progress,
      progresses: [progress],
      customDataProviders,
    });

    expect(
      (dataProvider as DataProviders & { customValue: string }).customValue,
    ).toBe('custom');
    expect(customDataProviders[0].customValue.getData).toHaveBeenCalledWith(
      progress,
      [progress],
    );
  });

  it('should not allow overriding existing properties', () => {
    const progress = new Progress({ total: 100 });
    const customDataProviders = [
      {
        value: {
          getData: jest.fn().mockReturnValue('should not override'),
        },
      },
    ];
    const dataProvider = DataProviders.build({
      progress,
      progresses: [progress],
      customDataProviders,
    });

    // Should still return the original value, not the custom one
    expect(dataProvider.value).toBe(0);
    expect(customDataProviders[0].value.getData).not.toHaveBeenCalled();
  });

  it('should filter out falsy custom data providers', () => {
    const progress = new Progress({ total: 100 });
    const customDataProviders = [
      null,
      undefined,
      false,
      {
        customValue: {
          getData: jest.fn().mockReturnValue('valid'),
        },
      },
    ] as never[];
    const dataProvider = DataProviders.build({
      progress,
      progresses: [progress],
      customDataProviders,
    });

    expect(
      (dataProvider as DataProviders & { customValue: string }).customValue,
    ).toBe('valid');
  });
});
