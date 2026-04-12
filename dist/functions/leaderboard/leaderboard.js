"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaderboardSort = void 0;
const forgescript_1 = require("@tryforge/forgescript");
const LevelsDatabase_1 = require("../../structures/LevelsDatabase");
const XpFormula_1 = require("../../structures/XpFormula");
var LeaderboardSort;
(function (LeaderboardSort) {
    LeaderboardSort[LeaderboardSort["xp"] = 0] = "xp";
    LeaderboardSort[LeaderboardSort["level"] = 1] = "level";
    LeaderboardSort[LeaderboardSort["messages"] = 2] = "messages";
})(LeaderboardSort || (exports.LeaderboardSort = LeaderboardSort = {}));
exports.default = new forgescript_1.NativeFunction({
    name: "$leaderboard",
    version: "1.0.0",
    description: "Returns a formatted leaderboard string for this guild.",
    brackets: false,
    unwrap: true,
    output: forgescript_1.ArgType.String,
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
            name: "format",
            description: "Row format. Tokens: {position} {userID} {user} {level} {xp} {messages}.",
            type: forgescript_1.ArgType.String,
            required: false,
            rest: false,
        },
        {
            name: "separator",
            description: "Row separator (default: newline).",
            type: forgescript_1.ArgType.String,
            required: false,
            rest: false,
        },
        {
            name: "sort",
            description: "Sort field: xp (default), level, or messages.",
            type: forgescript_1.ArgType.Enum,
            enum: LeaderboardSort,
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
    async execute(ctx, [page, perPage, format, separator, sort, guild]) {
        const gid = guild?.id ?? ctx.guild?.id;
        if (!gid)
            return this.customError("Missing guild.");
        const p = Math.max(1, page ?? 1);
        const pp = Math.min(25, Math.max(1, perPage ?? 10));
        const fmt = format ?? "{position}. <@{userID}> — Level {level} ({xp} XP)";
        const sep = separator ?? "\n";
        const cfg = await LevelsDatabase_1.LevelsDatabase.resolvedConfig(gid);
        const records = await LevelsDatabase_1.LevelsDatabase.getLeaderboard(gid, p, pp, sort ?? LeaderboardSort.xp);
        const offset = (p - 1) * pp;
        if (!records.length)
            return this.success("No data yet.");
        const lines = await Promise.all(records.map(async (rec, i) => {
            const { level } = (0, XpFormula_1.levelFromXp)(rec.xp, cfg);
            let user = `<@${rec.userId}>`;
            try {
                const u = await ctx.client.users.fetch(rec.userId);
                user = u.username;
            }
            catch { }
            return fmt
                .replace("{position}", String(offset + i + 1))
                .replace("{userID}", rec.userId)
                .replace("{user}", user)
                .replace("{level}", String(level))
                .replace("{xp}", String(rec.xp))
                .replace("{messages}", String(rec.totalMessages));
        }));
        return this.success(lines.join(sep));
    },
});
//# sourceMappingURL=leaderboard.js.map