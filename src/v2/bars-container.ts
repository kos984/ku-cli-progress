import { TerminalTty } from '../terminals/terminal-tty';
import { Bar } from './bar';
import { Progress } from './progress';


export class BarsContainer {
  protected items: Bar[] = [];
  protected isStarted = false;
  protected nextUpdate: null | Promise<never> = null;

  public constructor(
    protected terminal = new TerminalTty(),
    ) { // FIXME: terminal should be interface
  }

  public add(bar: Bar) {
    // FIXME: attach if started
    this.items.push(bar)
    if (this.isStarted) {
      this.addListenerToProgress(bar)
    }
    return this;
  }

  public removeByProgress(progress: Progress) {
    this.items = this.items.filter(
      item => !item.getProgresses().find(p => p == progress)
    )
    this.refresh();
  }

  public render() {
    const lines = this.items.map( bar => {
      return bar.render();
    })
    this.terminal.write(lines.join('\n') + '\n');
  }

  public start() {
    this.isStarted = true;
    this.items.forEach(item => this.addListenerToProgress(item))
    this.render();
  }

  protected addListenerToProgress(item: Bar) {
    item.getProgresses().forEach(progress => {
      progress.on('update', this.refresh);
    });
  }

  protected refresh = () => {
    if (!this.isStarted || this.nextUpdate) {
      return;
    }
    this.nextUpdate = new Promise(resolve => {
      setTimeout(() => {
        this.nextUpdate = null;
        this.render();
      }, 50); // FIXME: config or constant
    })
  }
}
