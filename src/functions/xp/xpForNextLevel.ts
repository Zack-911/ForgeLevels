import { ArgType, NativeFunction } from "@tryforge/forgescript"
import { LevelsDatabase } from "../../structures/LevelsDatabase"
import { levelFromXp } from "../../structures/XpFormula"

export default new NativeFunction({
    name: "$xpForNextLevel",
    version: "1.0.0",
    description: "Returns the XP needed for the member's next level.",
    brackets: false,
    unwrap: true,
    output: ArgType.Number,
    args: [
        { name: "userID", type: ArgType.String, description: "User ID. Defaults to author.", required: false, rest: false },
        { name: "guildID", type: ArgType.Guild, description: "Guild ID. Defaults to current.", required: false, rest: false },
    ],
    async execute(ctx, [userId, guild]) {
        const uid = userId ?? ctx.user?.id
        const gid = guild?.id ?? ctx.guild?.id
        if (!uid || !gid) return this.customError("Missing user or guild.")
        const record = await LevelsDatabase.getOrCreate(gid, uid)
        const cfg = await LevelsDatabase.resolvedConfig(gid)
        const { nextLevelXp } = levelFromXp(record.xp, cfg)
        return this.success(nextLevelXp)
    },
})
