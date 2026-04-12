import { ArgType, NativeFunction } from "@tryforge/forgescript"
import { LevelsDatabase } from "../../structures/LevelsDatabase"
import { totalXpForLevel } from "../../structures/XpFormula"

export default new NativeFunction({
    name: "$setLevel",
    version: "1.0.0",
    description: "Sets a member's level, adjusting their XP to the base of that level.",
    brackets: true,
    unwrap: true,
    args: [
        {
            name: "level",
            description: "The level to set.",
            type: ArgType.Number,
            required: true,
            rest: false,
        },
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
    async execute(ctx, [level, userId, guild]) {
        const uid = userId ?? ctx.user?.id
        const gid = guild?.id ?? ctx.guild?.id
        if (!uid || !gid) return this.customError("Missing user or guild.")
        const cfg = await LevelsDatabase.resolvedConfig(gid)
        const record = await LevelsDatabase.getOrCreate(gid, uid)
        record.level = Math.max(0, level)
        record.xp = totalXpForLevel(record.level, cfg)
        await LevelsDatabase.setMember(record)
        return this.success()
    },
})
