import { Progress, SpinnerDataProvider, BarItem } from '../../';

jest.mock('../time/time');
import { Time } from '../time/time';

describe('spinner.data-provider', () => {
  it('SLASH', () => {
    const time = new Time() as jest.Mocked<Time>;
    time.getTime
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(501)
      .mockReturnValueOnce(1002)
      .mockReturnValueOnce(1302)
      .mockReturnValueOnce(1503)
      .mockReturnValueOnce(2004);
    const progress = new Progress({ total: 100 });
    const spinner = new SpinnerDataProvider({
      ...SpinnerDataProvider.presets.SLASH,
      time,
    });
    const barItem = new BarItem<{
      dataProviders: { spinner: string };
    }>(progress, {
      template: ({ spinner }) => `[${spinner}]`,
      dataProviders: {
        spinner,
      },
    });
    expect(barItem.render()).toEqual('[\\]');
    expect(barItem.render()).toEqual('[|]');
    expect(barItem.render()).toEqual('[/]');
    expect(barItem.render()).toEqual('[/]');
    expect(barItem.render()).toEqual('[-]');
    expect(barItem.render()).toEqual('[\\]');
  });
  it('BRAILLE', () => {
    const progress = new Progress({ total: 100 });
    const time = new Time() as jest.Mocked<Time>;
    time.getTime
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(501)
      .mockReturnValueOnce(1002)
      .mockReturnValueOnce(1302)
      .mockReturnValueOnce(1503)
      .mockReturnValueOnce(2004);
    const spinner = new SpinnerDataProvider({
      ...SpinnerDataProvider.presets.BRAILLE,
      time,
    });
    const barItem = new BarItem<{
      dataProviders: { spinner: string };
    }>(progress, {
      template: ({ spinner }) => `[${spinner}]`,
      dataProviders: {
        spinner,
      },
    });
    expect(barItem.render()).toEqual('[⠹]');
    expect(barItem.render()).toEqual('[⠸]');
    expect(barItem.render()).toEqual('[⠼]');
    expect(barItem.render()).toEqual('[⠼]');
    expect(barItem.render()).toEqual('[⠴]');
  });
  it('custom', () => {
    const progress = new Progress({ total: 100 });
    const time = new Time() as jest.Mocked<Time>;
    time.getTime
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(501)
      .mockReturnValueOnce(1002)
      .mockReturnValueOnce(1302)
      .mockReturnValueOnce(1503)
      .mockReturnValueOnce(2004);
    const spinner = new SpinnerDataProvider({
      chars: ['.  ', '.. ', '...'],
      time,
    });
    const barItem = new BarItem<{
      dataProviders: { spinner: string };
    }>(progress, {
      template: ({ spinner }) => `[${spinner}]`,
      dataProviders: {
        spinner,
      },
    });
    expect(barItem.render()).toEqual('[.  ]');
    expect(barItem.render()).toEqual('[.. ]');
    expect(barItem.render()).toEqual('[...]');
    expect(barItem.render()).toEqual('[...]');
    expect(barItem.render()).toEqual('[.  ]');
  });

  it('should use default parameters when not provided', () => {
    const progress = new Progress({ total: 100 });
    const spinner = new SpinnerDataProvider();

    // Should use default SLASH chars
    expect((spinner as unknown as { chars: string[] }).chars).toEqual(
      SpinnerDataProvider.presets.SLASH.chars,
    );
    expect((spinner as unknown as { delay: number }).delay).toBe(500);
    expect((spinner as unknown as { time: unknown }).time).toBeInstanceOf(Time);
  });

  it('should use custom delay when provided', () => {
    const progress = new Progress({ total: 100 });
    const customDelay = 1000;
    const spinner = new SpinnerDataProvider({
      delay: customDelay,
    });

    expect((spinner as unknown as { delay: number }).delay).toBe(customDelay);
  });

  it('should use custom time when provided', () => {
    const progress = new Progress({ total: 100 });
    const customTime = new Time();
    const spinner = new SpinnerDataProvider({
      time: customTime,
    });

    expect((spinner as unknown as { time: unknown }).time).toBe(customTime);
  });

  it('should not update spinner when progress is complete', () => {
    const progress = new Progress({ total: 100 });
    progress.set(100); // Complete the progress
    const time = new Time() as jest.Mocked<Time>;
    time.getTime.mockReturnValue(0);

    const spinner = new SpinnerDataProvider({
      time,
    });

    const firstChar = spinner.getData(progress);
    time.getTime.mockReturnValue(1000); // Time has passed
    const secondChar = spinner.getData(progress);

    // Should return the same character since progress is complete
    expect(firstChar).toBe(secondChar);
  });
});
