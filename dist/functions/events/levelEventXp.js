"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
exports.default = new forgescript_1.NativeFunction({
    name: "$levelEventLevel",
    version: "1.0.0",
    description: "Inside a levelReward event command, returns the level that triggered the reward.",
    unwrap: true,
    output: forgescript_1.ArgType.Number,
    args: [],
    async execute(ctx) {
        // @ts-ignore
        return this.success(ctx.runtime.extras.level);
    },
});
//# sourceMappingURL=levelEventXp.js.map