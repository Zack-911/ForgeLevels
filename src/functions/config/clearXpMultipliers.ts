import { ArgType, NativeFunction } from "@tryforge/forgescript"
import { LevelsDatabase } from "../../structures/LevelsDatabase"

export default new NativeFunction({
    name: "$clearXpMultipliers",
    version: "1.0.0",
    description: "Removes all XP multipliers configured for this guild.",
    brackets: false,
    unwrap: true,
    args: [
        {
            name: "guildID",
            description: "The guild ID. Defaults to current guild.",
            type: ArgType.Guild,
            required: false,
            rest: false,
        },
    ],
    async execute(ctx, [guild]) {
        const gid = guild?.id ?? ctx.guild?.id
        if (!gid) return this.customError("Missing guild.")
        await LevelsDatabase.patchConfig(gid, "multipliers", [])
        return this.success()
    },
})
