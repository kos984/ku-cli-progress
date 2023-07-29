"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Eta = void 0;
class Eta {
    constructor() {
        this.started = Date.now();
        this.updates = [];
        this.duration = 0;
        this.speed = NaN;
        this.updated = 0;
    }
    attach(progress) {
        this.progress = progress;
        progress.on('tick', ({ delta, value }) => {
            if (this.updates.length && Date.now() - this.updates[this.updates.length - 1].time < 200) {
                return;
            }
            this.updates.push({
                value,
                time: Date.now(),
            });
            if (this.updates.length > 5) {
                this.updates.shift();
            }
        });
    }
    getEtaS() {
        const speed = this.getSpeed();
        if (Number.isNaN(speed) || !this.progress) {
            return NaN;
        }
        return Math.round((this.progress.getTotal() - this.progress.getValue()) / speed);
    }
    getSpeed() {
        if (this.updates.length < 2) {
            return NaN;
        }
        if (!Number.isNaN(this.speed) && Date.now() - this.updated < 1000) {
            return this.speed;
        }
        const last = this.updates[this.updates.length - 1];
        const start = this.updates.reduce((prev, next) => {
            if (last.time - prev.time <= 5000) {
                return prev;
            }
            return next === last ? prev : next;
        });
        this.speed = (last.value - start.value) * 1000 / (last.time - start.time);
        return this.speed;
    }
    getDurationMs() {
        var _a, _b;
        if (((_b = (_a = this.progress) === null || _a === void 0 ? void 0 : _a.getProgress()) !== null && _b !== void 0 ? _b : 0) >= 1) {
            return this.duration;
        }
        this.duration = Date.now() - this.started;
        return this.duration;
    }
}
exports.Eta = Eta;
//# sourceMappingURL=eta.js.map