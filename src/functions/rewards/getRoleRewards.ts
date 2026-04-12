import { ArgType, NativeFunction } from "@tryforge/forgescript"
import { LevelsDatabase } from "../../structures/LevelsDatabase"

export default new NativeFunction({
    name: "$getRoleRewards",
    version: "1.0.0",
    description: "Returns a formatted list of all role rewards configured for this guild.",
    brackets: false,
    unwrap: true,
    output: ArgType.String,
    args: [
        {
            name: "format",
            description: "Row format. Supports: {level} {roleID} {persistent}. Default: \"Level {level}: <@&{roleID}>\"",
            type: ArgType.String,
            required: false,
            rest: false,
        },
        {
            name: "separator",
            description: "Row separator (default: newline).",
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
    async execute(ctx, [format, separator, guild]) {
        const gid = guild?.id ?? ctx.guild?.id
        if (!gid) return this.customError("Missing guild.")
        const cfg = await LevelsDatabase.getConfig(gid)
        const rewards = (cfg.roleRewards ?? []).sort((a, b) => a.level - b.level)
        if (!rewards.length) return this.success("No role rewards configured.")

        const fmt = format ?? "Level {level}: <@&{roleID}>"
        const sep = separator ?? "\n"

        const lines = rewards.map(r =>
            fmt
                .replace("{level}", String(r.level))
                .replace("{roleID}", r.roleId)
                .replace("{persistent}", String(r.persistent ?? true))
        )
        return this.success(lines.join(sep))
    },
})
