jest.mock('../../lib/terminals/terminal-tty');
jest.mock('../helpers/loop-progresses');
jest.mock('../../lib/formatters/bars-formatter');
jest.mock('../../lib/time/time');
import { Time } from '../../lib/time/time';
import { Time as TimeMock } from '../../lib/time/__mocks__/time';
(Time as never as typeof TimeMock).setMockTimeForAll(0);

import { TerminalTty } from '../../lib/terminals/terminal-tty';
import { bar } from './multi-start.example';

describe('MultiStartExample', () => {
  const terminalMock = new TerminalTty() as jest.Mocked<TerminalTty>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('bar should be defined', () => {
    expect(bar).toBeDefined();
  });

  it('one by one', () => {
    bar.render();
    const calls = terminalMock.write.mock.calls
      .map(call => call[0])
      .map(item => item.split('\n').filter(Boolean));
    expect(calls).toMatchObject([
      [
        '[=---------------------------------------] 2% ETA: ∞ speed: 0/s duration: 0s 18/1000',
        '[==--------------------------------------] 6% ETA: ∞ speed: 0/s duration: 0s 61/1000',
        '[=========================---------------] 63% ETA: ∞ speed: 0/s duration: 0s 627/1000',
        '[======----------------------------------] 16% ETA: ∞ speed: 0/s duration: 0s 158/1000',
        '[==============================----------] 74% ETA: ∞ speed: 0/s duration: 0s 740/1000',
        '[================================--------] 80% ETA: ∞ speed: 0/s duration: 0s 802/1000',
        '[=======---------------------------------] 18% ETA: ∞ speed: 0/s duration: 0s 178/1000',
      ],
    ]);
  });

  it('should test the async function passed to start', async () => {
    // Import the start function to test it directly
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { start } = require('../helpers/loop-progresses');

    // Mock the start function to capture the async function
    const mockStart = jest.fn();
    jest.doMock('../helpers/loop-progresses', () => ({
      start: mockStart,
    }));

    // Re-import the module to trigger the start call
    jest.resetModules();
    require('./multi-start.example');

    // Verify that start was called with an async function
    expect(mockStart).toHaveBeenCalledWith(expect.any(Function));

    // Test the async function directly
    const asyncFunction = mockStart.mock.calls[0][0];
    expect(typeof asyncFunction).toBe('function');

    // Call the async function to ensure it doesn't throw
    await expect(asyncFunction()).resolves.toBeUndefined();
  });
});
