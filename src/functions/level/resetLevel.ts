import { ArgType, NativeFunction } from "@tryforge/forgescript"
import { LevelsDatabase } from "../../structures/LevelsDatabase"

export default new NativeFunction({
    name: "$resetLevel",
    version: "1.0.0",
    description: "Resets a member's XP and level to 0.",
    brackets: false,
    unwrap: true,
    args: [
        {
            name: "userID",
            description: "The user ID to reset. Defaults to command author.",
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
        await LevelsDatabase.resetMember(gid, uid)
        return this.success()
    },
})
