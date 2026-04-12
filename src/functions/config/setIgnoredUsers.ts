import { ArgType, NativeFunction } from "@tryforge/forgescript"
import { LevelsDatabase } from "../../structures/LevelsDatabase"

export default new NativeFunction({
    name: "$setIgnoredUsers",
    version: "1.0.0",
    description: "Sets users who won't earn XP. Comma-separated IDs; pass empty to clear.",
    brackets: true,
    unwrap: true,
    args: [
        { name: "userIDs", type: ArgType.String, description: "Comma-separated user IDs.", required: false, rest: false },
        { name: "guildID", type: ArgType.Guild, description: "Guild ID. Defaults to current.", required: false, rest: false },
    ],
    async execute(ctx, [ids, guild]) {
        const gid = guild?.id ?? ctx.guild?.id
        if (!gid) return this.customError("Missing guild.")
        const cfg = await LevelsDatabase.getConfig(gid)
        const ignore = cfg.ignore ?? {}
        ignore.userIds = ids ? ids.split(",").map(s => s.trim()).filter(Boolean) : []
        await LevelsDatabase.patchConfig(gid, "ignore", ignore)
        return this.success()
    },
})
