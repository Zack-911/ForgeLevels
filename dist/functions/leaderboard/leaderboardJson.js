"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const LevelsDatabase_1 = require("../../structures/LevelsDatabase");
const XpFormula_1 = require("../../structures/XpFormula");
const leaderboard_1 = require("./leaderboard");
exports.default = new forgescript_1.NativeFunction({
    name: "$leaderboardJson",
    version: "1.0.0",
    description: "Returns the leaderboard as a JSON string for fully custom rendering.",
    brackets: false,
    unwrap: true,
    output: forgescript_1.ArgType.Json,
    args: [
        {
            name: "page",
            description: "The page number (default: 1).",
            type: forgescript_1.ArgType.Number,
            required: false,
            rest: false,
        },
        {
            name: "perPage",
            description: "Entries per page (default: 10, max: 25).",
            type: forgescript_1.ArgType.Number,
            required: false,
            rest: false,
        },
        {
            name: "sort",
            description: "Sort field: xp (default), level, or messages.",
            type: forgescript_1.ArgType.Enum,
            enum: leaderboard_1.LeaderboardSort,
            required: false,
            rest: false,
        },
        {
            name: "guildID",
            description: "The guild ID. Defaults to current guild.",
            type: forgescript_1.ArgType.Guild,
            required: false,
            rest: false,
        },
    ],
    async execute(ctx, [page, perPage, sort, guild]) {
        const gid = guild?.id ?? ctx.guild?.id;
        if (!gid)
            return this.customError("Missing guild.");
        const p = Math.max(1, page ?? 1);
        const pp = Math.min(25, Math.max(1, perPage ?? 10));
        const offset = (p - 1) * pp;
        const cfg = await LevelsDatabase_1.LevelsDatabase.resolvedConfig(gid);
        const total = await LevelsDatabase_1.LevelsDatabase.getTotalMembers(gid);
        const records = await LevelsDatabase_1.LevelsDatabase.getLeaderboard(gid, p, pp, sort ?? leaderboard_1.LeaderboardSort.xp);
        const entries = await Promise.all(records.map(async (rec, i) => {
            const { level, currentLevelXp, nextLevelXp, progress } = (0, XpFormula_1.levelFromXp)(rec.xp, cfg);
            let username = null;
            let displayName = null;
            let avatarURL = null;
            try {
                const u = await ctx.client.users.fetch(rec.userId);
                username = u.username;
                displayName = u.displayName;
                avatarURL = u.displayAvatarURL();
            }
            catch { }
            return {
                position: offset + i + 1,
                userId: rec.userId,
                username,
                displayName,
                avatarURL,
                level,
                totalXp: rec.xp,
                currentLevelXp,
                nextLevelXp,
                progress: Math.round(progress * 100),
                totalMessages: rec.totalMessages,
            };
        }));
        return this.success(JSON.stringify({
            page: p,
            perPage: pp,
            totalEntries: total,
            totalPages: Math.ceil(total / pp),
            entries,
        }));
    },
});
//# sourceMappingURL=leaderboardJson.js.map