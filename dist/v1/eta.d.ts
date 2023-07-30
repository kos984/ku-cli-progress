import { Progress } from './progress';
export declare class Eta {
    protected progress?: Progress;
    protected started: number;
    protected updates: {
        time: number;
        value: number;
    }[];
    protected duration: number;
    protected speed: number;
    protected updated: number;
    attach(progress: Progress): void;
    getEtaS(): number;
    getSpeed(): number;
    getDurationMs(): number;
}
