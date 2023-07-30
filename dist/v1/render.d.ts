import { Progress } from './progress';
import { IRender } from './types';
export interface IBarParams {
    completeChar: string;
    resumeChar: string;
    width: number;
    glue: string;
}
export interface IRenderParams {
    template: string;
    bar: Partial<IBarParams>;
    format: {
        [key: string]: (str: string, progress: Progress[]) => string;
    };
}
export declare class Render implements IRender {
    static readonly preset: {
        shades: {
            bar: {
                completeChar: string;
                resumeChar: string;
            };
        };
        classic: {
            bar: {
                completeChar: string;
                resumeChar: string;
            };
        };
        rect: {
            bar: {
                completeChar: string;
                resumeChar: string;
            };
        };
    };
    protected static assignParams(...params: Array<Partial<IRenderParams>>): IRenderParams & {
        bar: IBarParams;
    };
    protected params: IRenderParams & {
        bar: IBarParams;
    };
    constructor(params?: Partial<IRenderParams>);
    render(progresses: Progress[]): string;
    renderBar(params: {
        progress: Progress;
        renderResume?: boolean;
        size?: number;
    }): string;
    renderBars(progresses: Progress[]): string;
}
