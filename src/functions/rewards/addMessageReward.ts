import { ArgType, NativeFunction } from "@tryforge/forgescript"
import { LevelsDatabase } from "../../structures/LevelsDatabase"

export default new NativeFunction({
    name: "$addMessageReward",
    version: "1.0.0",
    description: "Adds a custom reward label at a specific level. Fires the levelReward event.",
    brackets: true,
    unwrap: true,
    args: [
        { name: "level", type: ArgType.Number, description: "The level that triggers this reward.", required: true, rest: false },
        { name: "label", type: ArgType.String, description: "A name/label for this reward.", required: true, rest: false },
        { name: "guildID", type: ArgType.Guild, description: "Guild ID. Defaults to current.", required: false, rest: false },
    ],
    async execute(ctx, [level, label, guild]) {
        const gid = guild?.id ?? ctx.guild?.id
        if (!gid) return this.customError("Missing guild.")
        const cfg = await LevelsDatabase.getConfig(gid)
        const rewards = cfg.messageRewards ?? []
        rewards.push({ level, label })
        await LevelsDatabase.patchConfig(gid, "messageRewards", rewards)
        return this.success()
    },
})
