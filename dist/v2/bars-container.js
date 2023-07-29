"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BarsContainer = void 0;
const terminal_tty_1 = require("../terminals/terminal-tty");
class BarsContainer {
    constructor(terminal = new terminal_tty_1.TerminalTty()) {
        this.terminal = terminal;
        this.items = [];
        this.isStarted = false;
        this.nextUpdate = null;
        this.refresh = () => {
            if (!this.isStarted || this.nextUpdate) {
                return;
            }
            this.nextUpdate = new Promise(resolve => {
                setTimeout(() => {
                    this.nextUpdate = null;
                    this.render();
                }, 50);
            });
        };
    }
    add(bar) {
        this.items.push(bar);
        if (this.isStarted) {
            this.addListenerToProgress(bar);
        }
        return this;
    }
    removeByProgress(progress) {
        this.items = this.items.filter(item => !item.getProgresses().find(p => p == progress));
        this.refresh();
    }
    render() {
        const lines = this.items.map(bar => {
            return bar.render();
        });
        this.terminal.write(lines.join('\n') + '\n');
    }
    log(str) {
        this.terminal.clear();
        console.log(str);
        this.terminal.refresh();
    }
    testLog(f) {
        this.terminal.clear();
        f();
        this.terminal.refresh();
    }
    start() {
        this.isStarted = true;
        this.items.forEach(item => this.addListenerToProgress(item));
        this.render();
    }
    addListenerToProgress(item) {
        item.getProgresses().forEach(progress => {
            progress.on('update', this.refresh);
        });
    }
}
exports.BarsContainer = BarsContainer;
//# sourceMappingURL=bars-container.js.map