import { ArgType, NativeFunction } from "@tryforge/forgescript"
import { LevelsDatabase } from "../../structures/LevelsDatabase"
import { ILevelConfig } from "../../structures/types"
import { LevelConfigKey } from "./setLevelConfig"

const KEY_NAMES = Object.keys(LevelConfigKey).filter(k => isNaN(Number(k))) as Array<keyof ILevelConfig>

export default new NativeFunction({
    name: "$getLevelConfig",
    version: "1.0.0",
    description: "Gets a per-guild leveling config value.",
    brackets: false,
    unwrap: true,
    output: ArgType.String,
    args: [
        {
            name: "key",
            description: "The config key to retrieve.",
            type: ArgType.Enum,
            enum: LevelConfigKey,
            required: true,
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
    async execute(ctx, [key, guild]) {
        const gid = guild?.id ?? ctx.guild?.id
        if (!gid) return this.customError("Missing guild.")

        const keyName = KEY_NAMES[key] as keyof ILevelConfig
        const cfg = await LevelsDatabase.resolvedConfig(gid)
        const val = (cfg as any)[keyName]
        if (val === undefined) return this.success()
        return this.success(typeof val === "object" ? JSON.stringify(val) : String(val))
    },
})
