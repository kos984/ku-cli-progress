import { IBarItem } from './bar-item.interface';
import { IBarOptions } from './bar-options.interface';

export interface IRender {
  render(options: IBarOptions, item: IBarItem): string;
  renderMulti(options: IBarOptions, items: IBarItem[]): string;

  getBarParts(progress: number, options: IBarOptions): { left: string; done: string };

  bar(progress: number, options: IBarOptions): string;
}
