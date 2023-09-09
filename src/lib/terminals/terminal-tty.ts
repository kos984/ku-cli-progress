import * as readline from 'readline';
import { ITerminal } from '../interfaces/terminal.interface';
import { WriteStream } from 'tty';

export class TerminalTty implements ITerminal {
  protected y = 0;
  protected prev = '';

  public constructor(
    protected stream: WriteStream = process.stderr
  ) {
    stream.on('resize', () => {
      this.clear();
      this.refresh();
    });
  }

  public cursor(enabled: boolean){
    if (enabled){
      this.stream.write('\x1B[?25h');
    }else{
      this.stream.write('\x1B[?25l');
    }
  }

  public resetCursor(lines: number){
    readline.moveCursor(this.stream, 0, -lines);
    readline.cursorTo(this.stream, 0);
  }

  public write(s: string) {
    const lines = s.split('\n');
    this.cursor(false);
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
    this.cursor(true);
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

}
