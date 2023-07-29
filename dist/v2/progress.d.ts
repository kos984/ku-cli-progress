/// <reference types="node" />
import { IProgress } from './interfaces/progress.interface';
import { IBarItem } from './interfaces/bar-item.interface';
import { EventEmitter } from 'events';
import { Eta } from './eta';
export interface IProgressParams {
    total: number;
    start?: number;
    tag?: string;
}
export declare class Progress extends EventEmitter implements IProgress, IBarItem {
    protected tag?: string;
    protected count: number;
    protected total: number;
    protected payload: any;
    protected eta: Eta;
    constructor(params: IProgressParams, payload?: {});
    increment(delta?: number, payload?: any): Progress;
    set(count: number, payload: any): Progress;
    protected update(count: number, payload?: any): Progress;
    getTotal(): number;
    getValue(): number;
    getPayload(): any;
    getProgress(): number;
    getTag(): string | undefined;
    getEta(): Eta;
}
