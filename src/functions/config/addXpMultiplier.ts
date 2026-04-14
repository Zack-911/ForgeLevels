import { ArgType, NativeFunction } from "@tryforge/forgescript"
import { LevelsDatabase } from "../../structures/LevelsDatabase"

export default new NativeFunction({
    name: "$addXpMultiplier",
    version: "1.0.0",
    description: "Adds an XP multiplier for a role or channel. Supply roleID or channelID (or both).",
    brackets: true,
    unwrap: true,
    args: [
        {
            name: "multiplier",
            description: "The multiplier value (e.g. 2 = double XP).",
            type: ArgType.Number,
            required: true,
            rest: false,
        },
        {
            name: "roleID",
            description: "Role ID that triggers this multiplier. Leave empty to skip.",
            type: ArgType.Role,
            required: false,
            rest: false,
        },
        {
            name: "channelID",
            description: "Channel ID that triggers this multiplier. Leave empty to skip.",
            type: ArgType.Channel,
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
    async execute(ctx, [multiplier, role, channel, guild]) {
        const gid = guild?.id ?? ctx.guild?.id
        if (!gid) return this.customError("Missing guild.")
        if (!role && !channel) return this.customError("Supply at least a roleID or channelID.")

        const cfg = await LevelsDatabase.getConfig(gid)
        const multipliers = cfg.multipliers ?? []

        // Prevent duplicates (Issue 20)
        const isDuplicate = multipliers.some(m => 
            m.multiplier === multiplier && 
            m.roleId === role?.id && 
            m.channelId === channel?.id
        )
        if (isDuplicate) return this.success()

        multipliers.push({
            multiplier,
            roleId: role?.id,
            channelId: channel?.id,
        })
        await LevelsDatabase.patchConfig(gid, "multipliers", multipliers)
        return this.success()
    },
})
