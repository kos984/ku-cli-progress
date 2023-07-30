"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Progress = void 0;
const events_1 = require("events");
const eta_1 = require("./eta");
class Progress extends events_1.EventEmitter {
    constructor(params) {
        var _a;
        super();
        this.tag = params.tag;
        this.count = (_a = params.start) !== null && _a !== void 0 ? _a : 0;
        this.total = params.total;
        this.render = params.render;
        this.eta = new eta_1.Eta();
        this.eta.attach(this);
    }
    increment(delta = 1, payload = {}) {
        const value = this.count + delta;
        this.emit('tick', { value, delta, payload: this.payload, newPayload: payload });
        return this.set(value, payload);
    }
    set(count, payload) {
        this.emit('update', {
            prev: {
                value: this.count,
                payload: this.payload
            },
            new: {
                value: count,
                payload,
            }
        });
        this.count = count;
        this.payload = payload;
        return this;
    }
    getTotal() {
        return this.total;
    }
    getValue() {
        return this.count;
    }
    getProgress() {
        const progress = this.count / this.total;
        return progress > 1 ? 1 : progress;
    }
    getRender() {
        return this.render;
    }
    getTag() {
        return this.tag;
    }
    getDataValue(key) {
        const map = {
            bar: () => this.render ? this.render.renderBar({ progress: this }) : null,
            speed: () => Math.round(this.eta.getSpeed()) + '/s',
            eta: () => this.eta.getEtaS() + 's',
            value: () => this.getValue().toString(),
            total: () => this.getTotal().toString(),
            percentage: () => Math.round(this.getProgress() * 100) + '%',
            duration: () => Math.round(this.eta.getDurationMs() / 1000) + 's',
        };
        if (map[key]) {
            return map[key]();
        }
        return this.payload && this.payload[key] ? this.payload[key] : null;
    }
}
exports.Progress = Progress;
//# sourceMappingURL=progress.js.map