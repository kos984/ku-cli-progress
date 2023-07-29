/// <reference types="node" />
import { Render } from './render';
import { EventEmitter } from 'events';
import { Eta } from './eta';
export interface IProgressParams {
    total: number;
    start?: number;
    render?: Render;
    tag?: string;
}
export declare class Progress extends EventEmitter {
    protected tag?: string;
    protected count: number;
    protected total: number;
    protected render?: Render;
    protected payload: any;
    protected eta: Eta;
    constructor(params: IProgressParams);
    increment(delta?: number, payload?: any): Progress;
    set(count: number, payload: any): Progress;
    getTotal(): number;
    getValue(): number;
    getProgress(): number;
    getRender(): Render | undefined;
    getTag(): string | undefined;
    getDataValue(key: string): any;
}
