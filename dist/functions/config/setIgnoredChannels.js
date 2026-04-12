"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const LevelsDatabase_1 = require("../../structures/LevelsDatabase");
exports.default = new forgescript_1.NativeFunction({
    name: "$setIgnoredChannels",
    version: "1.0.0",
    description: "Sets channels where XP is not awarded. Comma-separated IDs; pass empty to clear.",
    brackets: true,
    unwrap: true,
    args: [
        { name: "channelIDs", type: forgescript_1.ArgType.String, description: "Comma-separated channel IDs.", required: false, rest: false },
        { name: "guildID", type: forgescript_1.ArgType.Guild, description: "Guild ID. Defaults to current.", required: false, rest: false },
    ],
    async execute(ctx, [ids, guild]) {
        const gid = guild?.id ?? ctx.guild?.id;
        if (!gid)
            return this.customError("Missing guild.");
        const cfg = await LevelsDatabase_1.LevelsDatabase.getConfig(gid);
        const ignore = cfg.ignore ?? {};
        ignore.channelIds = ids ? ids.split(",").map(s => s.trim()).filter(Boolean) : [];
        await LevelsDatabase_1.LevelsDatabase.patchConfig(gid, "ignore", ignore);
        return this.success();
    },
});
//# sourceMappingURL=setIgnoredChannels.js.map