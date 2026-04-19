import { ArgType, NativeFunction } from "@tryforge/forgescript"
import { LevelsDatabase } from "../../structures/LevelsDatabase"
import { levelFromXp } from "../../structures/XpFormula"

export enum LeaderboardSort {
    xp,       // Sort by total XP (default)
    level,    // Sort by level
    messages, // Sort by message count
}

export default new NativeFunction({
    name: "$leaderboard",
    version: "1.0.0",
    description: "Returns a formatted leaderboard string for this guild.",
    brackets: false,
    unwrap: true,
    output: ArgType.String,
    args: [
        {
            name: "page",
            description: "The page number (default: 1).",
            type: ArgType.Number,
            required: false,
            rest: false,
        },
        {
            name: "perPage",
            description: "Entries per page (default: 10, max: 25).",
            type: ArgType.Number,
            required: false,
            rest: false,
        },
        {
            name: "format",
            description: "Row format. Tokens: {position} {userID} {user} {level} {xp} {messages}.",
            type: ArgType.String,
            required: false,
            rest: false,
        },
        {
            name: "separator",
            description: "Row separator (default: newline).",
            type: ArgType.String,
            required: false,
            rest: false,
        },
        {
            name: "sort",
            description: "Sort field: xp (default), level, or messages.",
            type: ArgType.Enum,
            enum: LeaderboardSort,
            required: false,
            rest: false,
        },
        {
            name: "guildID",
            description: "The guild ID. Defaults to current guild.",
            type: ArgType.Guild,
            required: false,
            rest: false,
        },
    ],
    async execute(ctx, [page, perPage, format, separator, sort, guild]) {
        const gid = guild?.id ?? ctx.guild?.id
        if (!gid) return this.customError("Missing guild.")

        const p = Math.max(1, page ?? 1)
        const pp = Math.min(25, Math.max(1, perPage ?? 10))
        const fmt = format ?? "{position}. <@{userID}> — Level {level} ({xp} XP)"
        const sep = separator ?? "\n"

        const cfg = await LevelsDatabase.resolvedConfig(gid)
        const records = await LevelsDatabase.getLeaderboard(gid, p, pp, sort ?? LeaderboardSort.xp)
        const offset = (p - 1) * pp

        if (!records.length) return this.success("No data yet.")

        const lines = await Promise.all(records.map(async (rec, i) => {
            const { level } = levelFromXp(rec.xp, cfg)
            let user = `<@${rec.userId}>`
            try {
                // Check cache first (Issue 13)
                const u = ctx.client.users.cache.get(rec.userId) ?? await ctx.client.users.fetch(rec.userId).catch(() => null)
                if (u) {
                    user = u.displayName // Use display name (Issue 17)
                }
            } catch { }
            return fmt
                .replaceAll("{position}", String(offset + i + 1))
                .replaceAll("{userID}", rec.userId)
                .replaceAll("{user}", user)
                .replaceAll("{level}", String(level))
                .replaceAll("{xp}", String(rec.xp))
                .replaceAll("{messages}", String(rec.totalMessages))
        }))

        return this.success(lines.join(sep))
    },
})
