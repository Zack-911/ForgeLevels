"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
exports.default = new forgescript_1.NativeFunction({
    name: "$levelEventTotalXp",
    version: "1.0.0",
    description: "Inside a levelUp event, returns the member's total XP after levelling up.",
    unwrap: true,
    output: forgescript_1.ArgType.Number,
    args: [],
    async execute(ctx) {
        // @ts-ignore
        return this.success(ctx.runtime.extras.totalXp);
    },
});
//# sourceMappingURL=levelEventTotalXp.js.map