"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Progress = void 0;
const events_1 = require("events");
const eta_1 = require("./eta");
class Progress extends events_1.EventEmitter {
    constructor(params, payload = {}) {
        var _a;
        super();
        this.tag = params.tag;
        this.count = (_a = params.start) !== null && _a !== void 0 ? _a : 0;
        this.total = params.total;
        this.eta = new eta_1.Eta();
        this.eta.attach(this);
        this.payload = payload;
    }
    increment(delta = 1, payload) {
        return this.update(this.count + delta, payload);
    }
    set(count, payload) {
        this.count = count;
        this.payload = payload;
        return this;
    }
    update(count, payload) {
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
        this.payload = payload ? payload : this.payload;
        return this;
    }
    getTotal() {
        return this.total;
    }
    getValue() {
        return this.count;
    }
    getPayload() {
        var _a;
        return (_a = this.payload) !== null && _a !== void 0 ? _a : {};
    }
    getProgress() {
        const progress = this.count / this.total;
        return progress > 1 ? 1 : progress;
    }
    getTag() {
        return this.tag;
    }
    getEta() {
        return this.eta;
    }
}
exports.Progress = Progress;
//# sourceMappingURL=progress.js.map