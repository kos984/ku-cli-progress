jest.mock('../../lib/terminals/terminal-tty');
jest.mock('../helpers/loop-progresses');
jest.mock('../../lib/formatters/bars-formatter');

import { TerminalTty } from '../../lib/terminals/terminal-tty';
import { bar } from './composite-progress.example';
import { ExampleBarTestHelper } from '../__tests__/example-bar-test-helper';

describe('CompositeProgressComponent', () => {
  const MAX_STEPS = 10;
  const terminalMock = new TerminalTty() as jest.Mocked<TerminalTty>;

  const exampleBarTestHelper = new ExampleBarTestHelper({
    bar,
    maxSteps: MAX_STEPS
  });

  beforeEach(() => {
    jest.clearAllMocks();
    exampleBarTestHelper.beforeEach();
  });

  it('one by one', () => {
    exampleBarTestHelper.iterate(progress => progress.getTotal() / MAX_STEPS);
    expect(terminalMock.write.mock.calls.map(call => call[0])).toMatchObject([
      '[00001░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░] 1300 (1000) total: 10000 13% (10%) ETA: 90s (90s)\n',
      '[000000001░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░] 2300 (2000) total: 10000 23% (20%) ETA: 80s (80s)\n',
      '[0000000000001░░░░░░░░░░░░░░░░░░░░░░░░░░░] 3300 (3000) total: 10000 33% (30%) ETA: 70s (70s)\n',
      '[00000000000000001░░░░░░░░░░░░░░░░░░░░░░░] 4300 (4000) total: 10000 43% (40%) ETA: 60s (60s)\n',
      '[000000000000000000001░░░░░░░░░░░░░░░░░░░] 5300 (5000) total: 10000 53% (50%) ETA: 50s (50s)\n',
      '[0000000000000000000000001░░░░░░░░░░░░░░░] 6300 (6000) total: 10000 63% (60%) ETA: 40s (40s)\n',
      '[00000000000000000000000000001░░░░░░░░░░░] 7300 (7000) total: 10000 73% (70%) ETA: 30s (30s)\n',
      '[000000000000000000000000000000001░░░░░░░] 8300 (8000) total: 10000 83% (80%) ETA: 20s (20s)\n',
      '[0000000000000000000000000000000000001░░░] 9300 (9000) total: 10000 93% (90%) ETA: 10s (10s)\n',
      '[0000000000000000000000000000000000000000] 10000 (10000) total: 10000 100% (100%) ETA: 0s (0s)\n',
    ]);
  });

  it('one by few', () => {
    exampleBarTestHelper.iterate(
      (progress, index) => (progress.getTotal() * (index + 1)) / MAX_STEPS,
    );
    expect(terminalMock.write.mock.calls.map(call => call[0])).toMatchObject([
      '[00000111░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░] 1300 (2000) total: 10000 13% (20%) ETA: 90s (90s)\n',
      '[0000000001111111░░░░░░░░░░░░░░░░░░░░░░░░] 2300 (4000) total: 10000 23% (40%) ETA: 80s (80s)\n',
      '[000000000000011111111111░░░░░░░░░░░░░░░░] 3300 (6000) total: 10000 33% (60%) ETA: 70s (70s)\n',
      '[00000000000000000111111111111111░░░░░░░░] 4300 (8000) total: 10000 43% (80%) ETA: 60s (60s)\n',
      '[0000000000000000000001111111111111111111] 5300 (10000) total: 10000 53% (100%) ETA: 50s (50s)\n',
      '[0000000000000000000000000111111111111111] 6300 (10000) total: 10000 63% (100%) ETA: 40s (40s)\n',
      '[0000000000000000000000000000011111111111] 7300 (10000) total: 10000 73% (100%) ETA: 30s (30s)\n',
      '[0000000000000000000000000000000001111111] 8300 (10000) total: 10000 83% (100%) ETA: 20s (20s)\n',
      '[0000000000000000000000000000000000000111] 9300 (10000) total: 10000 93% (100%) ETA: 10s (10s)\n',
      '[0000000000000000000000000000000000000000] 10000 (10000) total: 10000 100% (100%) ETA: 0s (0s)\n',
    ]);
  });

  it('one by few2', () => {
    exampleBarTestHelper.iterate(
      (progress, index) =>
        (progress.getTotal() *
          (exampleBarTestHelper.progresses.length - index)) /
        MAX_STEPS,
    );
    expect(terminalMock.write.mock.calls.map(call => call[0])).toMatchObject([
      '[000011111░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░] 2300 (1000) total: 10000 23% (10%) ETA: 90s (90s)\n',
      '[00000000111111111░░░░░░░░░░░░░░░░░░░░░░░] 4300 (2000) total: 10000 43% (20%) ETA: 80s (80s)\n',
      '[0000000000001111111111111░░░░░░░░░░░░░░░] 6300 (3000) total: 10000 63% (30%) ETA: 70s (70s)\n',
      '[000000000000000011111111111111111░░░░░░░] 8300 (4000) total: 10000 83% (40%) ETA: 60s (60s)\n',
      '[0000000000000000000011111111111111111111] 10000 (5000) total: 10000 100% (50%) ETA: 50s (50s)\n',
      '[0000000000000000000000001111111111111111] 10000 (6000) total: 10000 100% (60%) ETA: 40s (40s)\n',
      '[0000000000000000000000000000111111111111] 10000 (7000) total: 10000 100% (70%) ETA: 30s (30s)\n',
      '[0000000000000000000000000000000011111111] 10000 (8000) total: 10000 100% (80%) ETA: 20s (20s)\n',
      '[0000000000000000000000000000000000001111] 10000 (9000) total: 10000 100% (90%) ETA: 10s (10s)\n',
      '[0000000000000000000000000000000000000000] 10000 (10000) total: 10000 100% (100%) ETA: 0s (0s)\n',
    ]);
  });
});
