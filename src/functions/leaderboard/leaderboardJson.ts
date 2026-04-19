import { ArgType, NativeFunction } from "@tryforge/forgescript"
import { LevelsDatabase } from "../../structures/LevelsDatabase"
import { levelFromXp } from "../../structures/XpFormula"
import { LeaderboardSort } from "./leaderboard"

export default new NativeFunction({
  name: "$leaderboardJson",
  version: "1.0.0",
  description: "Returns the leaderboard as a JSON string for fully custom rendering.",
  brackets: false,
  unwrap: true,
  output: ArgType.Json,
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
  async execute(ctx, [page, perPage, sort, guild]) {
    const gid = guild?.id ?? ctx.guild?.id
    if (!gid) return this.customError("Missing guild.")

    const p = Math.max(1, page ?? 1)
    const pp = Math.min(25, Math.max(1, perPage ?? 10))
    const offset = (p - 1) * pp

    const cfg = await LevelsDatabase.resolvedConfig(gid)
    const total = await LevelsDatabase.getTotalMembers(gid)
    const records = await LevelsDatabase.getLeaderboard(gid, p, pp, sort ?? LeaderboardSort.xp)

    const entries = await Promise.all(records.map(async (rec, i) => {
      const { level, currentLevelXp, nextLevelXp, progress } = levelFromXp(rec.xp, cfg)

      let username: string | null = null
      let displayName: string | null = null
      let avatarURL: string | null = null
      try {
        const u = ctx.client.users.cache.get(rec.userId) ?? await ctx.client.users.fetch(rec.userId).catch(() => null)
        if (u) {
          username = u.username
          displayName = u.displayName
          avatarURL = u.displayAvatarURL()
        }
      } catch { }

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
      }
    }))

    return this.success(JSON.stringify({
      page: p,
      perPage: pp,
      totalEntries: total,
      totalPages: Math.ceil(total / pp),
      entries,
    }))
  },
})