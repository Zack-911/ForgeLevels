"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
exports.default = new forgescript_1.NativeFunction({
    name: "$levelEventOldLevel",
    version: "1.0.0",
    description: "Inside a levelUp event command, returns the old level.",
    unwrap: true,
    output: forgescript_1.ArgType.Number,
    args: [],
    async execute(ctx) { return this.success(ctx.extras?.oldLevel ?? 0); },
});
//# sourceMappingURL=levelEventOldLevel.js.map