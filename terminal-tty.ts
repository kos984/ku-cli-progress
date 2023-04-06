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
    this.clear();
    const lines = s.split('\n');
    this.y = lines.length - 1;
    this.stream.write(lines.map(l => l.substr(0, process.stdout.columns)).join('\n'));
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
