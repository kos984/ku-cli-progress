"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bar = void 0;
const render_1 = require("./render");
const terminal_tty_1 = require("../terminals/terminal-tty");
const events_1 = require("events");
class Bar extends events_1.EventEmitter {
    constructor(progresses = [], render = new render_1.Render()) {
        super();
        this.progresses = progresses;
        this.render = render;
        this.terminal = new terminal_tty_1.TerminalTty();
    }
    async start() {
        this.emit('start');
        while (true) {
            await new Promise(r => {
                this.renderBars();
                setTimeout(() => r(true), 100);
            });
            if (this.isComplete(this.progresses)) {
                this.renderBars();
                this.emit('complete');
                break;
            }
        }
    }
    add(progress) {
        this.progresses.push(progress);
    }
    remove(progress) {
        this.progresses = this.progresses.filter(p => p !== progress);
        this.renderBars();
    }
    renderBars() {
        const bars = this.progresses.map(p => {
            var _a;
            const processes = Array.isArray(p) ? p : [p];
            const render = (_a = processes[0].getRender()) !== null && _a !== void 0 ? _a : this.render;
            return render.render(processes);
        });
        this.terminal.write(bars.join('\n') + '\n');
    }
    isComplete(processes) {
        let completed = true;
        for (const process of processes) {
            completed = Array.isArray(process) ? this.isComplete(process) : process.getProgress() >= 1;
            if (!completed) {
                return false;
            }
        }
        return completed;
    }
}
exports.Bar = Bar;
//# sourceMappingURL=bar.js.map