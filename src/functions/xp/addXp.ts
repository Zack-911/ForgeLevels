import { ArgType, NativeFunction } from "@tryforge/forgescript"
import { LevelsDatabase } from "../../structures/LevelsDatabase"
import { levelFromXp } from "../../structures/XpFormula"
import { ForgeLevels } from "../.."

export default new NativeFunction({
    name: "$addXp",
    version: "1.0.0",
    description: "Manually adds XP to a member, triggering levelUp if applicable.",
    brackets: true,
    unwrap: true,
    args: [
        {
            name: "xp",
            description: "Amount of XP to add.",
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

        const cfg = await LevelsDatabase.resolvedConfig(gid)
        const record = await LevelsDatabase.getOrCreate(gid, uid)
        const oldLevel = levelFromXp(record.xp, cfg).level

        record.xp = Math.max(0, record.xp + xp)
        record.level = levelFromXp(record.xp, cfg).level

        await LevelsDatabase.setMember(record)

        const ext = ctx.client.getExtension(ForgeLevels, true)

        if (xp > 0) {
            ext.emitter.emit("xpGain", { userId: uid, guildId: gid, xp, totalXp: record.xp, obj: ctx.obj })
        }

        if (record.level > oldLevel) {
            ext.emitter.emit("levelUp", {
                userId: uid,
                guildId: gid,
                oldLevel,
                newLevel: record.level,
                totalXp: record.xp,
                obj: ctx.obj
            })
        }

        if (record.level < oldLevel) {
            ext.emitter.emit("levelDown", {
                userId: uid,
                guildId: gid,
                oldLevel,
                newLevel: record.level,
                totalXp: record.xp,
                obj: ctx.obj
            })
        }
        return this.success()
    },
})