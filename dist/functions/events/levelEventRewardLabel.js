"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
exports.default = new forgescript_1.NativeFunction({
    name: "$levelEventRewardLabel",
    version: "1.0.0",
    description: "Inside a levelReward event command, returns the reward label.",
    unwrap: true,
    output: forgescript_1.ArgType.String,
    args: [],
    async execute(ctx) { return this.success(ctx.extras?.label ?? ""); },
});
//# sourceMappingURL=levelEventRewardLabel.js.map