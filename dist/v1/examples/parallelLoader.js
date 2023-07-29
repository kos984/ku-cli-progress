"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const progress_1 = require("../progress");
const bar_1 = require("../bar");
const files = [];
for (let i = 0; i < 30; i++) {
    files.push({ size: Math.round(Math.random() * 10000) });
}
const process = (file) => {
    const emitter = new events_1.EventEmitter();
    const dataLength = 100;
    let size = file.size;
    const interval = setInterval(() => {
        if (dataLength < size) {
            size -= dataLength;
            return emitter.emit('data', dataLength);
        }
        emitter.emit('data', size);
        emitter.emit('end');
        clearInterval(interval);
    }, 100);
    return emitter;
};
const runner = async (files, batchSize = 5) => {
    const bars = [];
    const mainProgress = new progress_1.Progress({ total: files.length });
    const bar = new bar_1.Bar([mainProgress]);
    bar.start();
    files = Array.from(files).reverse();
    const promises = [];
    const next = () => {
        const file = files.pop();
        if (!file) {
            return Promise.resolve(true);
        }
        return new Promise(r => {
            const progress = new progress_1.Progress({ total: file.size });
            bar.add(progress);
            const emitter = process(file);
            emitter.on('data', (size) => progress.increment(size));
            emitter.on('end', () => {
                bar.remove(progress);
                mainProgress.increment();
                r(true);
            });
        }).then(() => next());
    };
    while (promises.length < batchSize) {
        promises.push(next());
    }
    await Promise.all(promises);
};
runner(files, 5).catch(err => console.log(err));
//# sourceMappingURL=parallelLoader.js.map