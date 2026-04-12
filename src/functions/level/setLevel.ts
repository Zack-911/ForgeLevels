import { ArgType, NativeFunction } from "@tryforge/forgescript"
import { LevelsDatabase } from "../../structures/LevelsDatabase"
import { totalXpForLevel } from "../../structures/XpFormula"
import { ForgeLevels } from "../.."

export default new NativeFunction({
    name: "$setLevel",
    version: "1.0.0",
    description: "Sets a member's level, adjusting their XP to the base of that level. Fires levelUp if the new level is higher.",
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
        const oldLevel = record.level

        record.level = Math.max(0, level)
        record.xp = totalXpForLevel(record.level, cfg)
        await LevelsDatabase.setMember(record)

        if (record.level > oldLevel) {
            const ext = ctx.client.getExtension(ForgeLevels, true)
            ext.emitter.emit("levelUp", {
                userId: uid,
                guildId: gid,
                oldLevel,
                newLevel: record.level,
                totalXp: record.xp,
                obj: ctx.obj,
            })
        }

        return this.success()
    },
})