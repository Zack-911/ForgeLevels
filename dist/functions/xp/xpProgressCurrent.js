"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const LevelsDatabase_1 = require("../../structures/LevelsDatabase");
const XpFormula_1 = require("../../structures/XpFormula");
exports.default = new forgescript_1.NativeFunction({
    name: "$xpProgress",
    version: "1.0.0",
    description: "Returns the member's XP within their current level (not total XP).",
    brackets: false,
    unwrap: true,
    output: forgescript_1.ArgType.Number,
    args: [
        { name: "userID", type: forgescript_1.ArgType.String, description: "User ID. Defaults to author.", required: false, rest: false },
        { name: "guildID", type: forgescript_1.ArgType.Guild, description: "Guild ID. Defaults to current.", required: false, rest: false },
    ],
    async execute(ctx, [userId, guild]) {
        const uid = userId ?? ctx.user?.id;
        const gid = guild?.id ?? ctx.guild?.id;
        if (!uid || !gid)
            return this.customError("Missing user or guild.");
        const record = await LevelsDatabase_1.LevelsDatabase.getOrCreate(gid, uid);
        const cfg = await LevelsDatabase_1.LevelsDatabase.resolvedConfig(gid);
        const { currentLevelXp } = (0, XpFormula_1.levelFromXp)(record.xp, cfg);
        return this.success(currentLevelXp);
    },
});
//# sourceMappingURL=xpProgressCurrent.js.map