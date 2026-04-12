import { ArgType, NativeFunction } from "@tryforge/forgescript"
import { LevelsDatabase } from "../../structures/LevelsDatabase"
import { levelFromXp } from "../../structures/XpFormula"

export default new NativeFunction({
    name: "$setXp",
    version: "1.0.0",
    description: "Sets a member's total XP directly, recalculating their level.",
    brackets: true,
    unwrap: true,
    args: [
        {
            name: "xp",
            description: "The XP value to set.",
            type: ArgType.Number,
            required: true,
            rest: false,
        },
        {
            name: "userID",
            description: "The user ID. Defaults to the command author.",
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
    async execute(ctx, [xp, userId, guild]) {
        const uid = userId ?? ctx.user?.id
        const gid = guild?.id ?? ctx.guild?.id
        if (!uid || !gid) return this.customError("Missing user or guild.")
        const record = await LevelsDatabase.getOrCreate(gid, uid)
        const cfg = await LevelsDatabase.resolvedConfig(gid)
        record.xp = Math.max(0, xp)
        record.level = levelFromXp(record.xp, cfg).level
        await LevelsDatabase.setMember(record)
        return this.success()
    },
})
