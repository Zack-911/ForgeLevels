import { ArgType, NativeFunction } from "@tryforge/forgescript"
import { LevelsDatabase } from "../../structures/LevelsDatabase"

export default new NativeFunction({
    name: "$resetGuildLevels",
    version: "1.0.0",
    description: "Wipes ALL leveling data (XP, levels, messages) for every member in this guild.",
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
        await LevelsDatabase.resetGuild(gid)
        return this.success()
    },
})
