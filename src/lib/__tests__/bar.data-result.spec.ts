import { BarDataResult } from '../data-providers/bar/bar.data-result';

describe('bar.data-result', () => {
  it('should be defined', () => {
    expect(BarDataResult).toBeDefined();
  });

  it('should return parts', () => {
    const parts = [
      { str: 'a', progress: undefined },
      { str: 'b', progress: undefined },
    ];
    const barDataResult = new BarDataResult(parts);
    expect(barDataResult.getParts()).toEqual(parts);
  });
});
