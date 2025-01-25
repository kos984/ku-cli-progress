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
});
