import { ArgType, NativeFunction } from "@tryforge/forgescript"
import { LevelsDatabase } from "../../structures/LevelsDatabase"

export default new NativeFunction({
    name: "$removeMessageReward",
    version: "1.0.0",
    description: "Removes a message reward at a level. Optionally filter by label.",
    brackets: true,
    unwrap: true,
    args: [
        { name: "level", type: ArgType.Number, description: "The level to remove the reward from.", required: true, rest: false },
        { name: "label", type: ArgType.String, description: "Label to match (optional).", required: false, rest: false },
        { name: "guildID", type: ArgType.Guild, description: "Guild ID. Defaults to current.", required: false, rest: false },
    ],
    async execute(ctx, [level, label, guild]) {
        const gid = guild?.id ?? ctx.guild?.id
        if (!gid) return this.customError("Missing guild.")
        const cfg = await LevelsDatabase.getConfig(gid)
        const rewards = (cfg.messageRewards ?? []).filter(r => {
            if (r.level !== level) return true
            if (label && r.label !== label) return true
            return false
        })
        await LevelsDatabase.patchConfig(gid, "messageRewards", rewards)
        return this.success()
    },
})
