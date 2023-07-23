import { TerminalTty } from '../terminals/terminal-tty';
import { Bar } from './bar';


export class BarsContainer {
  protected items: Bar[] = [];

  public constructor(
    protected terminal = new TerminalTty(),
    ) { // FIXME: terminal should be interface
  }

  public add(bar: Bar) {
    this.items.push(bar)
    return this;
  }

  public render() {
    const lines = this.items.map( bar => {
      return bar.render();
    })
    this.terminal.write(lines.join('\n') + '\n');
  }
}
