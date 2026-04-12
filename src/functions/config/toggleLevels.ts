import { ArgType, NativeFunction } from "@tryforge/forgescript"
import { LevelsDatabase } from "../../structures/LevelsDatabase"

export default new NativeFunction({
    name: "$toggleLevels",
    version: "1.0.0",
    description: "Toggles the leveling system on/off for this guild. Returns the new state.",
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
        const next = !cfg.enabled
        await LevelsDatabase.patchConfig(gid, "enabled", next)
        return this.success(next)
    },
})
