import * as readline from 'readline';
import { WriteStream } from 'tty';

export class TerminalTty {
  protected y = 0;
  protected prev = '';

  public constructor(protected stream: WriteStream = process.stdout) { // TODO: add type
    process.stdout.on('resize', () => {
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

  public write(s: string, rawWrite=false){
    const lines = s.split('\n');
    this.stream.write('\x1B[?25l'); // disable cursor TODO: move out
    this.resetCursor(this.y);
    const maxLength = Math.min(process.stdout.rows, lines.length) - 1;
    lines.forEach((l, i) => {
      if (i > maxLength) {
        return;
      }
      this.stream.write(l.substr(0, process.stdout.columns));
      readline.clearLine(this.stream, 1);
      if (i < maxLength) {
        this.stream.write('\n');
      }
    });
    this.stream.write('\x1B[?25h');
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
