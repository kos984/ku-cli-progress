"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TerminalTty = void 0;
const readline = require("readline");
class TerminalTty {
    constructor() {
        this.y = 0;
        this.prev = '';
        this.stream = process.stdout;
        process.stdout.on('resize', () => {
            this.clear();
            this.refresh();
        });
    }
    cursor(enabled) {
        if (enabled) {
            this.stream.write('\x1B[?25h');
        }
        else {
            this.stream.write('\x1B[?25l');
        }
    }
    resetCursor(lines) {
        readline.moveCursor(this.stream, 0, -lines);
        readline.cursorTo(this.stream, 0);
    }
    write(s) {
        const lines = s.split('\n');
        this.cursor(false);
        this.resetCursor(this.y);
        const maxLength = Math.min(this.stream.rows, lines.length) - 1;
        lines.forEach((l, i) => {
            if (i > maxLength) {
                return;
            }
            this.stream.write(l.substr(0, this.stream.columns));
            readline.clearLine(this.stream, 1);
            if (i < maxLength) {
                this.stream.write('\n');
            }
        });
        readline.clearScreenDown(this.stream);
        this.cursor(true);
        this.y = maxLength;
        this.prev = s;
    }
    clear() {
        this.resetCursor(this.y);
        readline.clearScreenDown(this.stream);
        readline.clearLine(this.stream, 0);
        this.y = 0;
    }
    refresh() {
        this.write(this.prev);
    }
}
exports.TerminalTty = TerminalTty;
//# sourceMappingURL=terminal-tty.js.map