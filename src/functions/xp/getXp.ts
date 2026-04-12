import { ArgType, NativeFunction } from "@tryforge/forgescript"
import { LevelsDatabase } from "../../structures/LevelsDatabase"

export default new NativeFunction({
    name: "$getXp",
    version: "1.0.0",
    description: "Returns a member's total XP in this guild.",
    brackets: false,
    unwrap: true,
    output: ArgType.Number,
    args: [
        {
            name: "userID",
            description: "The user ID to look up. Defaults to the command author.",
            type: ArgType.String,
            required: false,
            rest: false,
        },
        {
            name: "guildID",
            description: "The guild ID. Defaults to the current guild.",
            type: ArgType.Guild,
            required: false,
            rest: false,
        },
    ],
    async execute(ctx, [userId, guild]) {
        const uid = userId ?? ctx.user?.id
        const gid = guild?.id ?? ctx.guild?.id
        if (!uid || !gid) return this.customError("Missing user or guild.")
        const record = await LevelsDatabase.getMember(gid, uid)
        return this.success(record?.xp ?? 0)
    },
})
