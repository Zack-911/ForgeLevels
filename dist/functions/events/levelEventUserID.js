"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
exports.default = new forgescript_1.NativeFunction({
    name: "$levelEventUserID",
    version: "1.0.0",
    description: "Inside a levelUp/xpGain/levelReward event, returns the user ID.",
    unwrap: true,
    output: forgescript_1.ArgType.String,
    args: [],
    async execute(ctx) {
        // @ts-ignore
        return this.success(ctx.runtime.extras.userId);
    },
});
//# sourceMappingURL=levelEventUserID.js.map