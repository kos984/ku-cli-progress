import { IProgress } from './progress.interface';

export interface IBarItem {
  getProgresses(): IProgress[];
  render(): string;
}
