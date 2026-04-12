import { ArgType, NativeFunction } from "@tryforge/forgescript"
import { LevelsDatabase } from "../../structures/LevelsDatabase"

export default new NativeFunction({
    name: "$addRoleReward",
    version: "1.0.0",
    description: "Adds a role reward granted when a member reaches a specific level.",
    brackets: true,
    unwrap: true,
    args: [
        {
            name: "level",
            description: "The level that triggers this reward.",
            type: ArgType.Number,
            required: true,
            rest: false,
        },
        {
            name: "roleID",
            description: "The role ID to grant.",
            type: ArgType.Role,
            required: true,
            rest: false,
        },
        {
            name: "persistent",
            description: "Whether to keep this role when surpassing the level (default: true).",
            type: ArgType.Boolean,
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
    async execute(ctx, [level, role, persistent, guild]) {
        const gid = guild?.id ?? ctx.guild?.id
        if (!gid) return this.customError("Missing guild.")
        if (!role) return this.customError("Invalid role.")

        const cfg = await LevelsDatabase.getConfig(gid)
        const rewards = cfg.roleRewards ?? []

        // Remove any existing reward for the same level
        const filtered = rewards.filter(r => r.level !== level)
        filtered.push({ level, roleId: role.id, persistent: persistent ?? true })

        await LevelsDatabase.patchConfig(gid, "roleRewards", filtered)
        return this.success()
    },
})
