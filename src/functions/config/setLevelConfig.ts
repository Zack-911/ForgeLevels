import { ArgType, NativeFunction } from "@tryforge/forgescript"
import { LevelsDatabase } from "../../structures/LevelsDatabase"
import { ILevelConfig } from "../../structures/types"

// Enums for ArgType.Enum usage
export enum LevelConfigKey {
    enabled,
    xpMin,
    xpMax,
    xpCooldown,
    xpMultiplier,
    formula,
    xpBase,
    xpExponent,
    customFormula,
    maxLevel,
    stackRoles,
}

export enum XPFormula {
    linear,
    quadratic,
    exponential,
    custom,
}

const KEY_NAMES = Object.keys(LevelConfigKey).filter(k => isNaN(Number(k))) as Array<keyof ILevelConfig>

export default new NativeFunction({
    name: "$setLevelConfig",
    version: "1.0.0",
    description: "Sets a per-guild leveling config value.",
    brackets: true,
    unwrap: true,
    args: [
        {
            name: "key",
            description: "The config key to set.",
            type: ArgType.Enum,
            enum: LevelConfigKey,
            required: true,
            rest: false,
        },
        {
            name: "value",
            description: "The value to set (parsed as JSON where applicable).",
            type: ArgType.String,
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
    async execute(ctx, [key, value, guild]) {
        const gid = guild?.id ?? ctx.guild?.id
        if (!gid) return this.customError("Missing guild.")

        const keyName = KEY_NAMES[key] as keyof ILevelConfig

        // Try to parse as JSON (handles booleans, numbers, etc.)
        let parsed: unknown = value
        try { parsed = JSON.parse(value) } catch { }

        if (keyName === "xpMin" || keyName === "xpMax") {
            const num = Number(parsed)
            if (isNaN(num)) return this.customError("Value must be a number.")

            const cfg = await LevelsDatabase.getConfig(gid)
            const other = keyName === "xpMin" ? (cfg.xpMax ?? 25) : (cfg.xpMin ?? 15)

            if (keyName === "xpMin" && num > other) return this.customError("xpMin cannot be greater than xpMax.")
            if (keyName === "xpMax" && num < other) return this.customError("xpMax cannot be less than xpMin.")
        }

        await LevelsDatabase.patchConfig(gid, keyName, parsed as any)
        return this.success()
    },
})
