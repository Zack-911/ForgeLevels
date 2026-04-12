"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
exports.default = new forgescript_1.NativeFunction({
    name: "$levelEventNewLevel",
    version: "1.0.0",
    description: "Inside a levelUp event command, returns the new level.",
    unwrap: true,
    output: forgescript_1.ArgType.Number,
    args: [],
    async execute(ctx) {
        // @ts-ignore
        return this.success(ctx.runtime.extras.newLevel);
    },
});
//# sourceMappingURL=levelEventNewLevel.js.map