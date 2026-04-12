import { ArgType, NativeFunction } from "@tryforge/forgescript"
import { LevelsDatabase } from "../../structures/LevelsDatabase"

export default new NativeFunction({
    name: "$getTotalMessages",
    version: "1.0.0",
    description: "Returns the total messages sent by a member (tracked since join).",
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
        const record = await LevelsDatabase.getMember(gid, uid)
        return this.success(record?.totalMessages ?? 0)
    },
})
