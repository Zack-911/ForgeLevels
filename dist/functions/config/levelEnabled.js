"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const LevelsDatabase_1 = require("../../structures/LevelsDatabase");
exports.default = new forgescript_1.NativeFunction({
    name: "$levelEnabled",
    version: "1.0.0",
    description: "Returns whether the leveling system is enabled in this guild.",
    brackets: false,
    unwrap: true,
    output: forgescript_1.ArgType.Boolean,
    args: [
        { name: "guildID", type: forgescript_1.ArgType.Guild, description: "Guild ID. Defaults to current.", required: false, rest: false },
    ],
    async execute(ctx, [guild]) {
        const gid = guild?.id ?? ctx.guild?.id;
        if (!gid)
            return this.customError("Missing guild.");
        const cfg = await LevelsDatabase_1.LevelsDatabase.resolvedConfig(gid);
        return this.success(cfg.enabled);
    },
});
//# sourceMappingURL=levelEnabled.js.map