import { ArgType, NativeFunction } from "@tryforge/forgescript"
import { LevelsDatabase } from "../../structures/LevelsDatabase"

export default new NativeFunction({
    name: "$removeRoleReward",
    version: "1.0.0",
    description: "Removes the role reward configured at a specific level.",
    brackets: true,
    unwrap: true,
    args: [
        {
            name: "level",
            description: "The level whose reward should be removed.",
            type: ArgType.Number,
            required: true,
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
    async execute(ctx, [level, guild]) {
        const gid = guild?.id ?? ctx.guild?.id
        if (!gid) return this.customError("Missing guild.")
        const cfg = await LevelsDatabase.getConfig(gid)
        const rewards = (cfg.roleRewards ?? []).filter(r => r.level !== level)
        await LevelsDatabase.patchConfig(gid, "roleRewards", rewards)
        return this.success()
    },
})
