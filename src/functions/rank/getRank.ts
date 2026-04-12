import { ArgType, NativeFunction } from "@tryforge/forgescript"
import { LevelsDatabase } from "../../structures/LevelsDatabase"

export default new NativeFunction({
    name: "$getRank",
    version: "1.0.0",
    description: "Returns a member's leaderboard rank in this guild (1 = highest XP).",
    brackets: false,
    unwrap: true,
    output: ArgType.Number,
    args: [
        {
            name: "userID",
            description: "The user ID. Defaults to command author.",
            type: ArgType.String,
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
    async execute(ctx, [userId, guild]) {
        const uid = userId ?? ctx.user?.id
        const gid = guild?.id ?? ctx.guild?.id
        if (!uid || !gid) return this.customError("Missing user or guild.")
        const rank = await LevelsDatabase.getRank(gid, uid)
        return this.success(rank === -1 ? 0 : rank)
    },
})
