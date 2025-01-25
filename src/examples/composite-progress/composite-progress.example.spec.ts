jest.mock('../../lib/terminals/terminal-tty');
jest.mock('../helpers/loop-progresses');
jest.mock('../../lib/formatters/bars-formatter');
jest.mock('../../lib/time/time');

import { TerminalTty } from '../../lib/terminals/terminal-tty';
import { bar } from './composite-progress.example';
import { ExampleBarTestHelper } from '../__tests__/example-bar-test-helper';

describe('CompositeProgressComponent', () => {
  const MAX_STEPS = 10;
  const terminalMock = new TerminalTty() as jest.Mocked<TerminalTty>;

  const exampleBarTestHelper = new ExampleBarTestHelper({
    bar,
    maxSteps: MAX_STEPS,
  });

  beforeEach(() => {
    jest.clearAllMocks();
    exampleBarTestHelper.beforeEach();
  });

  it('one by one', () => {
    exampleBarTestHelper.iterate(progress => progress.getTotal() / MAX_STEPS);
    const calls = terminalMock.write.mock.calls.map(call => call[0]);
    expect(calls).toMatchObject([
      '[00001111░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░] \x1B[32mread: 200/1000 ( 20% eta: ∞)\x1B[39m \x1B[93mwrite: 100/1000 ( 10% eta: ∞)\x1B[39m\n',
      '[000000001111░░░░░░░░░░░░░░░░░░░░░░░░░░░░] \x1B[32mread: 300/1000 ( 30% eta: 4s)\x1B[39m \x1B[93mwrite: 200/1000 ( 20% eta: 4s)\x1B[39m\n',
      '[0000000000001111░░░░░░░░░░░░░░░░░░░░░░░░] \x1B[32mread: 400/1000 ( 40% eta: 4s)\x1B[39m \x1B[93mwrite: 300/1000 ( 30% eta: 5s)\x1B[39m\n',
      '[00000000000000001111░░░░░░░░░░░░░░░░░░░░] \x1B[32mread: 500/1000 ( 50% eta: 4s)\x1B[39m \x1B[93mwrite: 400/1000 ( 40% eta: 5s)\x1B[39m\n',
      '[000000000000000000001111░░░░░░░░░░░░░░░░] \x1B[32mread: 600/1000 ( 60% eta: 3s)\x1B[39m \x1B[93mwrite: 500/1000 ( 50% eta: 4s)\x1B[39m\n',
      '[0000000000000000000000001111░░░░░░░░░░░░] \x1B[32mread: 700/1000 ( 70% eta: 3s)\x1B[39m \x1B[93mwrite: 600/1000 ( 60% eta: 4s)\x1B[39m\n',
      '[00000000000000000000000000001111░░░░░░░░] \x1B[32mread: 800/1000 ( 80% eta: 2s)\x1B[39m \x1B[93mwrite: 700/1000 ( 70% eta: 3s)\x1B[39m\n',
      '[000000000000000000000000000000001111░░░░] \x1B[32mread: 900/1000 ( 90% eta: 1s)\x1B[39m \x1B[93mwrite: 800/1000 ( 80% eta: 2s)\x1B[39m\n',
      '[0000000000000000000000000000000000001111] \x1B[32mread: 1000/1000 ( 100% eta: 0s)\x1B[39m \x1B[93mwrite: 900/1000 ( 90% eta: 1s)\x1B[39m\n',
      '[0000000000000000000000000000000000000000] \x1B[32mread: 1000/1000 ( 100% eta: 0s)\x1B[39m \x1B[93mwrite: 1000/1000 ( 100% eta: 0s)\x1B[39m\n',
    ]);
  });

  it('one by few', () => {
    exampleBarTestHelper.iterate(
      (progress, index) => (progress.getTotal() * (index + 1)) / MAX_STEPS,
    );
    const calls = terminalMock.write.mock.calls.map(call => call[0]);
    expect(calls).toMatchObject([
      '[00000000░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░] \x1B[32mread: 200/1000 ( 20% eta: ∞)\x1B[39m \x1B[93mwrite: 200/1000 ( 20% eta: ∞)\x1B[39m\n',
      '[0000000000001111░░░░░░░░░░░░░░░░░░░░░░░░] \x1B[32mread: 300/1000 ( 30% eta: 4s)\x1B[39m \x1B[93mwrite: 400/1000 ( 40% eta: 2s)\x1B[39m\n',
      '[000000000000000011111111░░░░░░░░░░░░░░░░] \x1B[32mread: 400/1000 ( 40% eta: 4s)\x1B[39m \x1B[93mwrite: 600/1000 ( 60% eta: 1s)\x1B[39m\n',
      '[00000000000000000000111111111111░░░░░░░░] \x1B[32mread: 500/1000 ( 50% eta: 4s)\x1B[39m \x1B[93mwrite: 800/1000 ( 80% eta: 1s)\x1B[39m\n',
      '[0000000000000000000000001111111111111111] \x1B[32mread: 600/1000 ( 60% eta: 3s)\x1B[39m \x1B[93mwrite: 1000/1000 ( 100% eta: 0s)\x1B[39m\n',
      '[0000000000000000000000000000111111111111] \x1B[32mread: 700/1000 ( 70% eta: 3s)\x1B[39m \x1B[93mwrite: 1000/1000 ( 100% eta: 0s)\x1B[39m\n',
      '[0000000000000000000000000000000011111111] \x1B[32mread: 800/1000 ( 80% eta: 2s)\x1B[39m \x1B[93mwrite: 1000/1000 ( 100% eta: 0s)\x1B[39m\n',
      '[0000000000000000000000000000000000001111] \x1B[32mread: 900/1000 ( 90% eta: 1s)\x1B[39m \x1B[93mwrite: 1000/1000 ( 100% eta: 0s)\x1B[39m\n',
      '[0000000000000000000000000000000000000000] \x1B[32mread: 1000/1000 ( 100% eta: 0s)\x1B[39m \x1B[93mwrite: 1000/1000 ( 100% eta: 0s)\x1B[39m\n',
    ]);
  });

  it('one by few2', () => {
    exampleBarTestHelper.iterate(
      (progress, index) =>
        (progress.getTotal() *
          (exampleBarTestHelper.progresses.length - index)) /
        MAX_STEPS,
    );
    const calls = terminalMock.write.mock.calls.map(call => call[0]);
    expect(calls).toMatchObject([
      '[000011111111░░░░░░░░░░░░░░░░░░░░░░░░░░░░] \x1B[32mread: 300/1000 ( 30% eta: ∞)\x1B[39m \x1B[93mwrite: 100/1000 ( 10% eta: ∞)\x1B[39m\n',
      '[00000000111111111111░░░░░░░░░░░░░░░░░░░░] \x1B[32mread: 500/1000 ( 50% eta: 1s)\x1B[39m \x1B[93mwrite: 200/1000 ( 20% eta: 4s)\x1B[39m\n',
      '[0000000000001111111111111111░░░░░░░░░░░░] \x1B[32mread: 700/1000 ( 70% eta: 1s)\x1B[39m \x1B[93mwrite: 300/1000 ( 30% eta: 5s)\x1B[39m\n',
      '[000000000000000011111111111111111111░░░░] \x1B[32mread: 900/1000 ( 90% eta: 0s)\x1B[39m \x1B[93mwrite: 400/1000 ( 40% eta: 5s)\x1B[39m\n',
      '[0000000000000000000011111111111111111111] \x1B[32mread: 1000/1000 ( 100% eta: 0s)\x1B[39m \x1B[93mwrite: 500/1000 ( 50% eta: 4s)\x1B[39m\n',
      '[0000000000000000000000001111111111111111] \x1B[32mread: 1000/1000 ( 100% eta: 0s)\x1B[39m \x1B[93mwrite: 600/1000 ( 60% eta: 4s)\x1B[39m\n',
      '[0000000000000000000000000000111111111111] \x1B[32mread: 1000/1000 ( 100% eta: 0s)\x1B[39m \x1B[93mwrite: 700/1000 ( 70% eta: 3s)\x1B[39m\n',
      '[0000000000000000000000000000000011111111] \x1B[32mread: 1000/1000 ( 100% eta: 0s)\x1B[39m \x1B[93mwrite: 800/1000 ( 80% eta: 2s)\x1B[39m\n',
      '[0000000000000000000000000000000000001111] \x1B[32mread: 1000/1000 ( 100% eta: 0s)\x1B[39m \x1B[93mwrite: 900/1000 ( 90% eta: 1s)\x1B[39m\n',
      '[0000000000000000000000000000000000000000] \x1B[32mread: 1000/1000 ( 100% eta: 0s)\x1B[39m \x1B[93mwrite: 1000/1000 ( 100% eta: 0s)\x1B[39m\n',
    ]);
  });
});
