import { TerminalTty } from './terminal-tty';
import { Progress } from './progress';

export class Render {
  protected colors: Array<(s: string) => string> = [];
  public constructor(protected terminal: TerminalTty) {
  }

  public setColors(colors: Array<(s: string) => string>) {
    this.colors = colors;
  }

  public write(text: string) {
    this.terminal.write(text);
  }

  protected render(progress: Progress[]) {
    const doneChar = '=';
    const progressChar = '-';
    const barSize = 40;

    const lines = [];
    const last = progress
      .map((item, index) => ({
        size: Math.round((item.getProgress()) * barSize),
        item,
        color: this.colors[index] ? this.colors[index] : (s: string) => s,
      }))
      .sort((a, b) => Math.sign(a.size - b.size))
      .reduce((prev, current) => {
        const length = current.size - prev.size;
        if (length > 0) {
          lines.push(current.color(doneChar.repeat( length > barSize ? barSize : length )));
        }
        return current;
      }, { size: 0 });

    if (barSize - last.size > 0) {
      lines.push(progressChar.repeat(barSize - last.size));
    }
    return lines.join('');
  }
}
