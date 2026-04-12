import { ArgType, NativeFunction } from "@tryforge/forgescript"
import { LevelsDatabase } from "../../structures/LevelsDatabase"
import { xpForLevel, totalXpForLevel } from "../../structures/XpFormula"

export enum XpRequiredMode {
    step,       // XP for just this level step
    cumulative, // Total XP from level 0
}

export default new NativeFunction({
    name: "$xpRequired",
    version: "1.0.0",
    description: "Returns the XP required to reach a given level. Mode: step (default) or cumulative.",
    brackets: true,
    unwrap: true,
    output: ArgType.Number,
    args: [
        {
            name: "level",
            description: "The target level.",
            type: ArgType.Number,
            required: true,
            rest: false,
        },
        {
            name: "mode",
            description: "step = XP for that level only; cumulative = total XP from 0.",
            type: ArgType.Enum,
            enum: XpRequiredMode,
            required: false,
            rest: false,
        },
        {
            name: "guildID",
            description: "The guild ID (for config). Defaults to current guild.",
            type: ArgType.Guild,
            required: false,
            rest: false,
        },
    ],
    async execute(ctx, [level, mode, guild]) {
        const gid = guild?.id ?? ctx.guild?.id
        const cfg = gid ? await LevelsDatabase.resolvedConfig(gid) : {}
        const result = mode === XpRequiredMode.cumulative
            ? totalXpForLevel(level, cfg)
            : xpForLevel(level, cfg)
        return this.success(result)
    },
})
