import { Progress } from './progress';
import { Render } from './render';
import { TerminalTty } from './terminals/terminal-tty';
import { EventEmitter } from 'events';
import { ITerminal } from './terminals/types';
import { IRender } from './types';

export interface IBarOptions {
  terminal?: ITerminal; // TODO: file ???
  render?: IRender;
}

export class Bar extends EventEmitter { // FIXME: refactor to multi-bar ???
  protected terminal = new TerminalTty()

  constructor(
    protected progresses: Array<Progress | Progress[]> = [],
    protected render: IRender = new Render()
  ) {
    super();
  }

  public async start() {
    this.emit('start');
    while(true) {
      await new Promise(r => {
        this.renderBars();
        setTimeout(() => r(true), 100);
      });
      if (this.isComplete(this.progresses)) {
        this.renderBars();
        this.emit('complete');
        break;
      }
    }
  }

  public add(progress: Progress | Progress[]) {
    this.progresses.push(progress);
  }

  public remove(progress: Progress | Progress[]) {
    this.progresses = this.progresses.filter(p => p !== progress);
    this.renderBars();
  }

  public renderBars() {
    const bars = this.progresses.map( p => {
      const processes = Array.isArray(p) ? p : [p];
      const render = processes[0].getRender() ?? this.render;
      return render.render(processes);
    })
    this.terminal.write(bars.join('\n') + '\n');
  }

  protected isComplete(processes: Array<Progress | Progress[]>): boolean {
    let completed = true;
    for(const process of processes) {
      completed = Array.isArray(process) ? this.isComplete(process) : process.getProgress() >= 1
      if (!completed) {
        return false;
      }
    }
    return completed;
  }

}
