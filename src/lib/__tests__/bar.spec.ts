import { Bar, Progress, BarItem, ITerminal } from '../../';

describe('Bar', () => {
  const mockTerminal = {
    clear: jest.fn(),
    refresh: jest.fn(),
    write: jest.fn((str: string) => undefined),
  };

  const refreshTimeMs = 5;
  const barOptions = { refreshTimeMs };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should use default terminal if not send any', () => {
    const bar = new Bar();
    expect((bar as Bar & { terminal: ITerminal }).terminal).toBeDefined();
  });

  it('bar start without updates', async () => {
    const bar = new Bar(mockTerminal);
    const progress = new Progress({ total: 100 });
    bar.add(new BarItem(progress));
    bar.start();
    bar.stop();
    expect(mockTerminal.write.mock.calls).toEqual([
      [
        '[----------------------------------------] 0% ETA: ∞ speed: 0/s duration: 0s 0/100\n',
      ],
    ]);
  });

  it('bar start with updates', async () => {
    const bar = new Bar(mockTerminal, barOptions);
    const progress = new Progress({ total: 100 });
    bar.add(new BarItem(progress));
    bar.start();
    progress.increment();
    await new Promise(resolve => setTimeout(resolve, refreshTimeMs * 2));
    bar.stop();
    expect(mockTerminal.write.mock.calls).toEqual([
      [
        '[----------------------------------------] 0% ETA: ∞ speed: 0/s duration: 0s 0/100\n',
      ],
      [
        '[----------------------------------------] 1% ETA: ∞ speed: 0/s duration: 0s 1/100\n',
      ],
    ]);
  });

  it('should be able remove progress', async () => {
    const bar = new Bar(mockTerminal, barOptions);
    const progress = new Progress({ total: 100 });
    const progressToRemove = new Progress({ total: 200, start: 50 });
    bar.add(new BarItem(progress)).add(new BarItem(progressToRemove)).start();
    progress.increment();
    await new Promise(resolve => setTimeout(resolve, refreshTimeMs * 2));
    bar.removeByProgress(progressToRemove);
    await new Promise(resolve => setTimeout(resolve, refreshTimeMs * 2));
    bar.stop();
    expect(mockTerminal.write.mock.calls).toEqual([
      [
        '[----------------------------------------] 0% ETA: ∞ speed: 0/s duration: 0s 0/100\n' +
          '[==========------------------------------] 25% ETA: ∞ speed: 0/s duration: 0s 50/200\n',
      ],
      [
        '[----------------------------------------] 1% ETA: ∞ speed: 0/s duration: 0s 1/100\n' +
          '[==========------------------------------] 25% ETA: ∞ speed: 0/s duration: 0s 50/200\n',
      ],
      [
        '[----------------------------------------] 1% ETA: ∞ speed: 0/s duration: 0s 1/100\n',
      ],
    ]);
  });

  it('should be able remove by progress', async () => {
    const bar = new Bar(mockTerminal, barOptions);
    const progress = new Progress({ total: 100 });
    const progressToRemove = new Progress({ total: 200, start: 50 });
    const barItemToRemove = new BarItem(progressToRemove);
    const barItemToRemove2 = new BarItem([]);
    bar.addProgress(progress).add(barItemToRemove).start();
    progress.increment();
    await new Promise(resolve => setTimeout(resolve, refreshTimeMs * 2));
    bar.remove(barItemToRemove);
    bar.remove(barItemToRemove2);
    await new Promise(resolve => setTimeout(resolve, refreshTimeMs * 2));
    bar.stop();
    expect(mockTerminal.write.mock.calls).toEqual([
      [
        '[----------------------------------------] 0% ETA: ∞ speed: 0/s duration: 0s 0/100\n' +
          '[==========------------------------------] 25% ETA: ∞ speed: 0/s duration: 0s 50/200\n',
      ],
      [
        '[----------------------------------------] 1% ETA: ∞ speed: 0/s duration: 0s 1/100\n' +
          '[==========------------------------------] 25% ETA: ∞ speed: 0/s duration: 0s 50/200\n',
      ],
      [
        '[----------------------------------------] 1% ETA: ∞ speed: 0/s duration: 0s 1/100\n',
      ],
    ]);
  });

  it('should be able add new process', async () => {
    const bar = new Bar(mockTerminal, barOptions);
    const progress = new Progress({ total: 100 });
    const progressToAdd = new Progress({ total: 200, start: 50 });
    bar.add(new BarItem(progress)).start();
    progress.increment();
    await new Promise(resolve => setTimeout(resolve, refreshTimeMs * 2));
    bar.add(new BarItem(progressToAdd));
    progressToAdd.increment();
    await new Promise(resolve => setTimeout(resolve, refreshTimeMs * 2));
    bar.stop();
    expect(mockTerminal.write.mock.calls).toEqual([
      [
        '[----------------------------------------] 0% ETA: ∞ speed: 0/s duration: 0s 0/100\n',
      ],
      [
        '[----------------------------------------] 1% ETA: ∞ speed: 0/s duration: 0s 1/100\n',
      ],
      [
        '[----------------------------------------] 1% ETA: ∞ speed: 0/s duration: 0s 1/100\n' +
          '[==========------------------------------] 26% ETA: ∞ speed: 0/s duration: 0s 51/200\n',
      ],
    ]);
  });
  it('logWrap', async () => {
    const bar = new Bar(mockTerminal, barOptions);
    const progress = new Progress({ total: 100 });
    bar.add(new BarItem(progress)).start();
    progress.increment();
    await new Promise(resolve => setTimeout(resolve, refreshTimeMs * 2));
    bar.logWrap(() => {
      mockTerminal.write('some log');
    });
    bar.stop();
    expect(mockTerminal.write.mock.calls).toEqual([
      [
        '[----------------------------------------] 0% ETA: ∞ speed: 0/s duration: 0s 0/100\n',
      ],
      [
        '[----------------------------------------] 1% ETA: ∞ speed: 0/s duration: 0s 1/100\n',
      ],
      ['some log'],
    ]);
  });
  it('should not render bar if not started', async () => {
    const bar = new Bar(mockTerminal, barOptions);
    const progress = new Progress({ total: 100 });
    bar.add(new BarItem(progress)).start();
    progress.increment();
    progress.increment();
    progress.increment();
    await new Promise(resolve => setTimeout(resolve, refreshTimeMs * 2));
    bar.stop();
    expect(mockTerminal.write.mock.calls).toEqual([
      [
        '[----------------------------------------] 0% ETA: ∞ speed: 0/s duration: 0s 0/100\n',
      ],
      [
        '[=---------------------------------------] 3% ETA: ∞ speed: 0/s duration: 0s 3/100\n',
      ],
    ]);
  });
});
