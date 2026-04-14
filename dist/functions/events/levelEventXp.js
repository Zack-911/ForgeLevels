"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
exports.default = new forgescript_1.NativeFunction({
    name: "$levelEventXp",
    version: "1.0.0",
    description: "Inside an xpGain event, returns the XP gained. Inside levelUp, returns total XP.",
    unwrap: true,
    output: forgescript_1.ArgType.Number,
    args: [],
    async execute(ctx) {
        // @ts-ignore
        const extras = ctx.runtime.extras;
        return this.success(extras.xp ?? extras.totalXp);
    },
});
//# sourceMappingURL=levelEventXp.js.map