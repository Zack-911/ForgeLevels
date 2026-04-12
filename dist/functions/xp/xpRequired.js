"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XpRequiredMode = void 0;
const forgescript_1 = require("@tryforge/forgescript");
const LevelsDatabase_1 = require("../../structures/LevelsDatabase");
const XpFormula_1 = require("../../structures/XpFormula");
var XpRequiredMode;
(function (XpRequiredMode) {
    XpRequiredMode[XpRequiredMode["step"] = 0] = "step";
    XpRequiredMode[XpRequiredMode["cumulative"] = 1] = "cumulative";
})(XpRequiredMode || (exports.XpRequiredMode = XpRequiredMode = {}));
exports.default = new forgescript_1.NativeFunction({
    name: "$xpRequired",
    version: "1.0.0",
    description: "Returns the XP required to reach a given level. Mode: step (default) or cumulative.",
    brackets: true,
    unwrap: true,
    output: forgescript_1.ArgType.Number,
    args: [
        {
            name: "level",
            description: "The target level.",
            type: forgescript_1.ArgType.Number,
            required: true,
            rest: false,
        },
        {
            name: "mode",
            description: "step = XP for that level only; cumulative = total XP from 0.",
            type: forgescript_1.ArgType.Enum,
            enum: XpRequiredMode,
            required: false,
            rest: false,
        },
        {
            name: "guildID",
            description: "The guild ID (for config). Defaults to current guild.",
            type: forgescript_1.ArgType.Guild,
            required: false,
            rest: false,
        },
    ],
    async execute(ctx, [level, mode, guild]) {
        const gid = guild?.id ?? ctx.guild?.id;
        const cfg = gid ? await LevelsDatabase_1.LevelsDatabase.resolvedConfig(gid) : {};
        const result = mode === XpRequiredMode.cumulative
            ? (0, XpFormula_1.totalXpForLevel)(level, cfg)
            : (0, XpFormula_1.xpForLevel)(level, cfg);
        return this.success(result);
    },
});
//# sourceMappingURL=xpRequired.js.map