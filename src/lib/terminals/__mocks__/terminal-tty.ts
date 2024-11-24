import { ITerminal } from '../../interfaces/terminal.interface';

export const writeMock = jest.fn();

export class TerminalTty implements ITerminal {
  public cursor = jest.fn();
  public resetCursor = jest.fn();
  public write = writeMock;
  public clear = jest.fn();
  public refresh = jest.fn();
}
