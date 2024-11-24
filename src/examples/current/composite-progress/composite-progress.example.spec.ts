jest.mock('../../../lib/terminals/terminal-tty');
jest.mock('../../helpers/loop-progresses');
jest.mock('../../../lib/formatters/bars-formatter');

import { TerminalTty } from '../../../lib/terminals/terminal-tty';
import { bar, progresses } from './composite-progress.example';
import { test } from '../../__tests__/helpers';

describe('CompositeProgressComponent', () => {
  const STEPS = 10;
  const terminalMock = new TerminalTty() as jest.Mocked<TerminalTty>;

  const { beforeEach: beforeEachHelper, iterate } = test(bar, STEPS);

  beforeEach(() => {
    jest.clearAllMocks();
    beforeEachHelper();
  });

  it('one by one', () => {
    iterate(progress => progress.getTotal() / STEPS);
    expect(
      terminalMock.write.mock.calls.map(call => call[0]),
    ).not.toMatchObject([
      '[0░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░] value: 300 ETA: Infinity etaHumanReadable: ∞ etaHumanReadable2: ∞ etaHumanReadable3:∞\n',
      '[11110░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░] value: 1300 ETA: 90 etaHumanReadable: 1m30s etaHumanReadable2: 1m30s etaHumanReadable3:0:01:30\n',
      '[111111110░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░] value: 2300 ETA: 80 etaHumanReadable: 1m20s etaHumanReadable2: 1m20s etaHumanReadable3:0:01:20\n',
      '[1111111111110░░░░░░░░░░░░░░░░░░░░░░░░░░░] value: 3300 ETA: 70 etaHumanReadable: 1m10s etaHumanReadable2: 1m10s etaHumanReadable3:0:01:10\n',
      '[11111111111111110░░░░░░░░░░░░░░░░░░░░░░░] value: 4300 ETA: 60 etaHumanReadable: 1m00s etaHumanReadable2: 1m00s etaHumanReadable3:0:01:00\n',
      '[111111111111111111110░░░░░░░░░░░░░░░░░░░] value: 5300 ETA: 50 etaHumanReadable: 50s etaHumanReadable2: 50s etaHumanReadable3:0:00:50\n',
      '[1111111111111111111111110░░░░░░░░░░░░░░░] value: 6300 ETA: 40 etaHumanReadable: 40s etaHumanReadable2: 40s etaHumanReadable3:0:00:40\n',
      '[11111111111111111111111111110░░░░░░░░░░░] value: 7300 ETA: 30 etaHumanReadable: 30s etaHumanReadable2: 30s etaHumanReadable3:0:00:30\n',
      '[111111111111111111111111111111110░░░░░░░] value: 8300 ETA: 20 etaHumanReadable: 20s etaHumanReadable2: 20s etaHumanReadable3:0:00:20\n',
      '[1111111111111111111111111111111111110░░░] value: 9300 ETA: 10 etaHumanReadable: 10s etaHumanReadable2: 10s etaHumanReadable3:0:00:10\n',
      '[0000000000000000000000000000000000000000] value: 10000 ETA: 0 etaHumanReadable: 0s etaHumanReadable2: 0s etaHumanReadable3:0:00:00\n',
    ]);
    // console.log(terminalMock.write.mock.calls.map(call => call[0]));
  });

  it('one by few', () => {
    iterate((progress, index) => (progress.getTotal() * (index + 1)) / STEPS);
    expect(
      terminalMock.write.mock.calls.map(call => call[0]),
    ).not.toMatchObject([
      '[0░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░] value: 300 ETA: Infinity etaHumanReadable: ∞ etaHumanReadable2: ∞ etaHumanReadable3:∞\n',
      '[11110░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░] value: 1300 ETA: 90 etaHumanReadable: 1m30s etaHumanReadable2: 1m30s etaHumanReadable3:0:01:30\n',
      '[111111110░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░] value: 2300 ETA: 80 etaHumanReadable: 1m20s etaHumanReadable2: 1m20s etaHumanReadable3:0:01:20\n',
      '[1111111111110░░░░░░░░░░░░░░░░░░░░░░░░░░░] value: 3300 ETA: 70 etaHumanReadable: 1m10s etaHumanReadable2: 1m10s etaHumanReadable3:0:01:10\n',
      '[11111111111111110░░░░░░░░░░░░░░░░░░░░░░░] value: 4300 ETA: 60 etaHumanReadable: 1m00s etaHumanReadable2: 1m00s etaHumanReadable3:0:01:00\n',
      '[111111111111111111110░░░░░░░░░░░░░░░░░░░] value: 5300 ETA: 50 etaHumanReadable: 50s etaHumanReadable2: 50s etaHumanReadable3:0:00:50\n',
      '[1111111111111111111111110░░░░░░░░░░░░░░░] value: 6300 ETA: 40 etaHumanReadable: 40s etaHumanReadable2: 40s etaHumanReadable3:0:00:40\n',
      '[11111111111111111111111111110░░░░░░░░░░░] value: 7300 ETA: 30 etaHumanReadable: 30s etaHumanReadable2: 30s etaHumanReadable3:0:00:30\n',
      '[111111111111111111111111111111110░░░░░░░] value: 8300 ETA: 20 etaHumanReadable: 20s etaHumanReadable2: 20s etaHumanReadable3:0:00:20\n',
      '[1111111111111111111111111111111111110░░░] value: 9300 ETA: 10 etaHumanReadable: 10s etaHumanReadable2: 10s etaHumanReadable3:0:00:10\n',
      '[0000000000000000000000000000000000000000] value: 10000 ETA: 0 etaHumanReadable: 0s etaHumanReadable2: 0s etaHumanReadable3:0:00:00\n',
    ]);
    // console.log(terminalMock.write.mock.calls.map(call => call[0]));
  });

  it('one by few2', () => {
    iterate(
      (progress, index) =>
        (progress.getTotal() * (progresses.length - index)) / STEPS,
    );
    expect(
      terminalMock.write.mock.calls.map(call => call[0]),
    ).not.toMatchObject([
      '[0░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░] value: 300 ETA: Infinity etaHumanReadable: ∞ etaHumanReadable2: ∞ etaHumanReadable3:∞\n',
      '[11110░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░] value: 1300 ETA: 90 etaHumanReadable: 1m30s etaHumanReadable2: 1m30s etaHumanReadable3:0:01:30\n',
      '[111111110░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░] value: 2300 ETA: 80 etaHumanReadable: 1m20s etaHumanReadable2: 1m20s etaHumanReadable3:0:01:20\n',
      '[1111111111110░░░░░░░░░░░░░░░░░░░░░░░░░░░] value: 3300 ETA: 70 etaHumanReadable: 1m10s etaHumanReadable2: 1m10s etaHumanReadable3:0:01:10\n',
      '[11111111111111110░░░░░░░░░░░░░░░░░░░░░░░] value: 4300 ETA: 60 etaHumanReadable: 1m00s etaHumanReadable2: 1m00s etaHumanReadable3:0:01:00\n',
      '[111111111111111111110░░░░░░░░░░░░░░░░░░░] value: 5300 ETA: 50 etaHumanReadable: 50s etaHumanReadable2: 50s etaHumanReadable3:0:00:50\n',
      '[1111111111111111111111110░░░░░░░░░░░░░░░] value: 6300 ETA: 40 etaHumanReadable: 40s etaHumanReadable2: 40s etaHumanReadable3:0:00:40\n',
      '[11111111111111111111111111110░░░░░░░░░░░] value: 7300 ETA: 30 etaHumanReadable: 30s etaHumanReadable2: 30s etaHumanReadable3:0:00:30\n',
      '[111111111111111111111111111111110░░░░░░░] value: 8300 ETA: 20 etaHumanReadable: 20s etaHumanReadable2: 20s etaHumanReadable3:0:00:20\n',
      '[1111111111111111111111111111111111110░░░] value: 9300 ETA: 10 etaHumanReadable: 10s etaHumanReadable2: 10s etaHumanReadable3:0:00:10\n',
      '[0000000000000000000000000000000000000000] value: 10000 ETA: 0 etaHumanReadable: 0s etaHumanReadable2: 0s etaHumanReadable3:0:00:00\n',
    ]);
    // console.log(terminalMock.write.mock.calls.map(call => call[0]));
  });
});
