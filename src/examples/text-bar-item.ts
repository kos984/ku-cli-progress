import { IBarItem } from '../lib/interfaces/bar-item.interface';
import { IProgress } from '../lib/interfaces/progress.interface';
import * as chalk from 'chalk';

export class TextBarItem implements IBarItem {
  constructor(protected text: string) {}
  public getProgresses(): IProgress[] {
    return [];
  }

  render(): string {
    return chalk.cyan(this.text);
  }
}
