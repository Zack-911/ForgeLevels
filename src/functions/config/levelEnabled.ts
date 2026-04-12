import { ArgType, NativeFunction } from "@tryforge/forgescript"
import { LevelsDatabase } from "../../structures/LevelsDatabase"

export default new NativeFunction({
    name: "$levelEnabled",
    version: "1.0.0",
    description: "Returns whether the leveling system is enabled in this guild.",
    brackets: false,
    unwrap: true,
    output: ArgType.Boolean,
    args: [
        { name: "guildID", type: ArgType.Guild, description: "Guild ID. Defaults to current.", required: false, rest: false },
    ],
    async execute(ctx, [guild]) {
        const gid = guild?.id ?? ctx.guild?.id
        if (!gid) return this.customError("Missing guild.")
        const cfg = await LevelsDatabase.resolvedConfig(gid)
        return this.success(cfg.enabled)
    },
})
