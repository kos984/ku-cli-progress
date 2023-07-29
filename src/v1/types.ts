import { Progress } from './progress';

export interface IRender {
  render(progresses: Progress[]): string;
  renderBar(params: { progress: Progress, renderResume?: boolean, size?: number }): string;
  renderBars(progresses: Progress[]): string;
}
