"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bar = void 0;
class Bar {
    constructor(progresses, params) {
        var _a, _b;
        this.progresses = progresses;
        this.template = `[{bar}] {percentage} ETA: {eta} speed: {speed} duration: {duration} {value}/{total}`;
        this.options = {
            completeChar: '=',
            resumeChar: '-',
            width: 40,
            glue: '',
        };
        this.getDataValue = (key, item) => {
            var _a;
            const map = {
                bars: () => this.renderBars(this.progresses),
                bar: () => this.bar(item.getProgress()),
                speed: () => Math.round(item.getEta().getSpeed()) + '/s',
                eta: () => item.getEta().getEtaS() + 's',
                value: () => item.getValue().toString(),
                total: () => item.getTotal().toString(),
                percentage: () => Math.round(item.getProgress() * 100) + '%',
                duration: () => Math.round(item.getEta().getDurationMs() / 1000) + 's',
            };
            const payload = item.getPayload();
            let value = (_a = payload[key]) !== null && _a !== void 0 ? _a : null;
            value = (value === null && map[key]) ? map[key]() : value;
            if (value === null)
                return value;
            return value;
        };
        this.template = (_a = params === null || params === void 0 ? void 0 : params.template) !== null && _a !== void 0 ? _a : this.template;
        this.options = { ...this.options, ...params === null || params === void 0 ? void 0 : params.options };
        this.formatters = (_b = params === null || params === void 0 ? void 0 : params.formatters) !== null && _b !== void 0 ? _b : {};
    }
    getProgresses() {
        return this.progresses;
    }
    renderBars(progresses) {
        const { resumeChar, width, glue } = this.options;
        const lines = [];
        const leftLength = progresses
            .map((item, index) => ({
            size: Math.round(item.getProgress() * width),
            item,
            index,
        }))
            .sort((a, b) => Math.sign(a.size - b.size))
            .reduce((prev, current) => {
            var _a;
            const length = current.size - prev.size;
            if (length > 0) {
                let line = this.getBarParts(length > width ? width : length).done;
                const item = current.item;
                const formatter = (_a = this.formatters[`${item.getTag()}_bar`]) !== null && _a !== void 0 ? _a : this.formatters['bar'];
                if (formatter) {
                    line = formatter(line, current.index, progresses);
                }
                lines.push(line);
            }
            return current;
        }, { size: 0 });
        if (width - leftLength.size > 0) {
            lines.push(resumeChar.repeat(width - leftLength.size));
        }
        return lines.join(glue);
    }
    render() {
        return this.template.replace(/{([^}]+)}/g, (match, prop) => {
            const [property, tag] = prop.split('_').reverse();
            const index = tag ? this.progresses.findIndex(p => p.getTag() === tag) : 0;
            if (index < 0)
                return match;
            const progress = this.progresses[index];
            const value = this.getDataValue(property, progress);
            if (value === null) {
                return match;
            }
            if (this.formatters[prop]) {
                return this.formatters[prop](value, index, this.progresses);
            }
            return value;
        });
    }
    getBarParts(size) {
        return {
            done: this.options.completeChar.repeat(size),
            left: this.options.resumeChar.repeat(this.options.width - size)
        };
    }
    bar(progress) {
        const size = Math.round(progress * this.options.width);
        const parts = this.getBarParts(size);
        return `${parts.done}${this.options.glue}${parts.left}`;
    }
}
exports.Bar = Bar;
//# sourceMappingURL=bar.js.map