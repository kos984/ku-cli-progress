"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bar = void 0;
const terminal_tty_1 = require("./terminals/terminal-tty");
class Bar {
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
    logWrap(logFunction) {
        this.terminal.clear();
        logFunction();
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
exports.Bar = Bar;
//# sourceMappingURL=bar.js.map