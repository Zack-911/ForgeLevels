"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
exports.default = new forgescript_1.NativeFunction({
    name: "$levelEventXp",
    version: "1.0.0",
    description: "Inside levelUp/xpGain event: XP gained (xpGain) or total XP after level-up (levelUp).",
    unwrap: true,
    output: forgescript_1.ArgType.Number,
    args: [],
    async execute(ctx) {
        const extras = ctx.extras;
        return this.success(extras?.xp ?? extras?.totalXp ?? 0);
    },
});
//# sourceMappingURL=levelEventXp.js.map