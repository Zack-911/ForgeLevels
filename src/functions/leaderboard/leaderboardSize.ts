import { ArgType, NativeFunction } from "@tryforge/forgescript"
import { LevelsDatabase } from "../../structures/LevelsDatabase"

export default new NativeFunction({
    name: "$leaderboardSize",
    version: "1.0.0",
    description: "Returns the total number of ranked members in the guild.",
    brackets: false,
    unwrap: true,
    output: ArgType.Number,
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
        return this.success(await LevelsDatabase.getTotalMembers(gid))
    },
})
