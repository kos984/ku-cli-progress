import { Progress } from './progress';
import { Render } from './render';
import { TerminalTty } from './terminal-tty';
import { createDeflateRaw } from 'zlib';

export class Bar {
  protected terminal = new TerminalTty()
  protected render = new Render();

  protected progress: Progress[][];

  constructor(progress: Array<Progress | Progress[]>, options?: any) {
    this.progress = progress.map(p => Array.isArray(p) ? p : [p]);
  }

  public start() {
    // render
    // setInterval(() => { }, 100);
    this.loop(); // TODO: catch
  }

  protected async loop() {
    while(true) {
      await new Promise(r => {
        const bars = this.progress.map( p => {
          if (p.length > 0) {
            const render = p[0].getRender() ?? this.render;
            return render.render(p);
          }
        })
        this.terminal.write(bars.join('\n'));
        setTimeout(() => r(true), 100);
      })
    }
  }

  public add(progress: Progress | Progress[]) {
    this.progress.push(Array.isArray(progress) ? progress : [ progress ]);
  }

  protected remove(progress: Progress) {
    // TODO: implement me
  }

}
