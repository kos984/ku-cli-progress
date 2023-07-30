import { IBarOptions } from './interfaces/bar-options.interface';
import { Progress } from './progress';
export interface IFormatters {
    [key: string]: (str: string, progress: Progress, progresses: Progress[]) => string;
}
export interface IDataProviders {
    [key: string]: (progress: Progress, progresses: Progress[]) => string;
}
export interface IParams {
    template?: string;
    options?: Partial<IBarOptions>;
    formatters?: IFormatters;
    dataProviders?: IDataProviders;
}
export declare class BarItem {
    protected progresses: Progress[];
    protected template: string;
    protected options: IBarOptions;
    protected formatters: IFormatters;
    protected dataProviders: IDataProviders;
    constructor(progresses: Progress[], params?: IParams);
    getProgresses(): Progress[];
    renderBars(progresses: Progress[]): string;
    render(): string;
    getBarParts(size: number): {
        left: string;
        done: string;
    };
    bar(progress: number): string;
    protected getDataValue: (key: string, item: Progress) => string | null;
}
