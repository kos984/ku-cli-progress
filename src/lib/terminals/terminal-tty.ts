import * as readline from 'readline';
import { ITerminal } from '../interfaces/terminal.interface';
import { WriteStream } from 'tty';

export class TerminalTty implements ITerminal {
  protected y = 0;
  protected prev = '';
  protected updateCursor: boolean = true;

  public constructor(protected stream: WriteStream = process.stderr) {
    stream.on('resize', () => {
      this.clear();
      this.refresh();
    });
  }

  public cursor(enabled: boolean) {
    this.updateCursor = false;
    this.writeCursor(enabled, true);
  }

  public resetCursor(lines: number) {
    readline.moveCursor(this.stream, 0, -lines);
    readline.cursorTo(this.stream, 0);
  }

  public write(s: string) {
    const lines = s.split('\n');
    this.writeCursor(false);
    this.resetCursor(this.y);
    const maxLength = Math.min(this.stream.rows, lines.length) - 1;
    lines.forEach((l, i) => {
      if (i > maxLength) {
        return;
      }
      this.stream.write(l.substring(0, this.stream.columns));
      readline.clearLine(this.stream, 1);
      if (i < maxLength) {
        this.stream.write('\n');
      }
    });
    readline.clearScreenDown(this.stream);
    this.writeCursor(true);
    this.y = maxLength;
    this.prev = s;
  }

  public clear() {
    this.resetCursor(this.y);
    readline.clearScreenDown(this.stream);
    readline.clearLine(this.stream, 0);
    this.y = 0;
  }

  public refresh() {
    this.write(this.prev);
  }

  public writeCursor(enabled: boolean, force: boolean = false) {
    if (!this.updateCursor && !force) {
      return;
    }
    this.stream.write(enabled ? '\x1B[?25h' : '\x1B[?25l');
  }
}
