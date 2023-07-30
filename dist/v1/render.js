"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Render = void 0;
class Render {
    static assignParams(...params) {
        const defaultParams = {
            template: `[{bar}] {percentage} ETA: {eta} speed: {speed} duration: {duration} {value}/{total}`,
            bar: {
                completeChar: '=',
                resumeChar: '-',
                width: 40,
                glue: '',
            },
            format: {
                bar: (srt) => srt,
                eta: (str) => str,
                value: (str) => str,
                total: (str) => str,
            },
        };
        const assignWithDefaults = (defaults, params) => ({
            ...defaults,
            ...params,
            bar: { ...defaults.bar, ...params.bar },
            format: { ...defaults.format, ...params.format },
        });
        return !params.length
            ? defaultParams
            : params.reduce(assignWithDefaults, defaultParams);
    }
    constructor(params = {}) {
        this.params = Render.assignParams(params);
    }
    render(progresses) {
        if (!progresses.length) {
            return '';
        }
        return this.params.template.replace(/{([^}]+)}/g, (match, p) => {
            var _a;
            const [property, tag] = p.split('_').reverse();
            const progress = tag ? progresses.find(p => p.getTag() === tag) : progresses[0];
            if (!progress) {
                return match;
            }
            const render = (_a = progress.getRender()) !== null && _a !== void 0 ? _a : this;
            const formatFunction = render.params.format[property];
            if (property === 'bars' && progresses.length > 1) {
                return formatFunction ? formatFunction(this.renderBars(progresses), progresses) : this.renderBars(progresses);
            }
            const value = progress.getDataValue(property);
            if (property === 'bar') {
                return value !== null && value !== void 0 ? value : render.renderBar({ progress });
            }
            if (!value) {
                return match;
            }
            return formatFunction ? formatFunction(value, progresses) : value.toString();
        });
    }
    renderBar(params) {
        var _a;
        const { completeChar, resumeChar, width, glue } = this.params.bar;
        const { renderResume, size } = {
            renderResume: true,
            size: (_a = params.size) !== null && _a !== void 0 ? _a : Math.round(params.progress.getProgress() * width),
            ...params,
        };
        const lines = [];
        lines.push(completeChar.repeat(size));
        if (renderResume) {
            lines.push(resumeChar.repeat(width - size));
        }
        const color = this.params.format.bar;
        return color(lines.join(glue), [params.progress]);
    }
    renderBars(progresses) {
        const { resumeChar, width, glue } = this.params.bar;
        const lines = [];
        const leftLength = progresses
            .map((item, index) => ({
            size: Math.round(item.getProgress() * width),
            item,
        }))
            .sort((a, b) => Math.sign(a.size - b.size))
            .reduce((prev, current) => {
            var _a;
            const length = current.size - prev.size;
            if (length > 0) {
                const render = (_a = current.item.getRender()) !== null && _a !== void 0 ? _a : this;
                lines.push(render.renderBar({
                    progress: current.item,
                    renderResume: false,
                    size: length > width ? width : length,
                }));
            }
            return current;
        }, { size: 0 });
        if (width - leftLength.size > 0) {
            lines.push(resumeChar.repeat(width - leftLength.size));
        }
        return lines.join(glue);
    }
}
exports.Render = Render;
Render.preset = {
    shades: { bar: { completeChar: '\u2588', resumeChar: '\u2591' } },
    classic: { bar: { completeChar: '=', resumeChar: '-' } },
    rect: { bar: { completeChar: '\u25A0', resumeChar: ' ' } },
};
//# sourceMappingURL=render.js.map