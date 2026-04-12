"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const LevelsDatabase_1 = require("../../structures/LevelsDatabase");
exports.default = new forgescript_1.NativeFunction({
    name: "$toggleLevels",
    version: "1.0.0",
    description: "Toggles the leveling system on/off for this guild. Returns the new state.",
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
        const next = !cfg.enabled;
        await LevelsDatabase_1.LevelsDatabase.patchConfig(gid, "enabled", next);
        return this.success(next);
    },
});
//# sourceMappingURL=toggleLevels.js.map