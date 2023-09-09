import { TerminalTty } from '../../';
import { WriteStream } from 'tty';

describe('terminal tty', () => {
  const mockStream = {
    write: jest.fn(),
    end: jest.fn(),
    destroy: jest.fn(),
    on: jest.fn(),
    columns: 80,
    rows: 10,
    writable: true,
    allowHalfOpen: true,
    isTTY: true,
  };

  it('init', () => {
    const terminal = new TerminalTty();
    expect(terminal).toBeDefined();
  });
  it('should write data to stream', () => {
    const terminal = new TerminalTty(mockStream as never as WriteStream);
    terminal.write('some test');
    expect(mockStream.write).toBeCalled();
  });
  it('should refresh when screen size updated', () => {
    const listeners = [];
    mockStream.on.mockImplementation((type: string, handler: (...params) => void) => {
      listeners.push(handler);
    })
    const terminal = new TerminalTty(mockStream as never as WriteStream);
    const clear = jest.spyOn(terminal, 'clear');
    const refresh = jest.spyOn(terminal, 'refresh');
    expect(listeners.length).toBe(1);
    listeners[0]();
    expect(clear).toBeCalledTimes(1);
    expect(refresh).toBeCalledTimes(1);
  });
  it('should not render more then screen size', () => {
    const terminal = new TerminalTty(mockStream as never as WriteStream);
    const text = ('0'.repeat(mockStream.columns * 2)+'\n')
      .repeat(mockStream.rows * 2);
    terminal.write(text);
    const calsWithText = mockStream.write.mock.calls
      .filter((s: [string]) => s.length > 0 && s[0].includes('000'))
      .map((s: [string]) => s[0]);

    expect(calsWithText.length).toEqual(mockStream.rows);
    calsWithText.forEach((s: string) => {
      expect(s.length).toEqual(mockStream.columns);
    });
  });
});
