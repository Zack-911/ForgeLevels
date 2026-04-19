"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XPFormula = exports.LevelConfigKey = void 0;
const forgescript_1 = require("@tryforge/forgescript");
const LevelsDatabase_1 = require("../../structures/LevelsDatabase");
// Enums for ArgType.Enum usage
var LevelConfigKey;
(function (LevelConfigKey) {
    LevelConfigKey[LevelConfigKey["enabled"] = 0] = "enabled";
    LevelConfigKey[LevelConfigKey["xpMin"] = 1] = "xpMin";
    LevelConfigKey[LevelConfigKey["xpMax"] = 2] = "xpMax";
    LevelConfigKey[LevelConfigKey["xpCooldown"] = 3] = "xpCooldown";
    LevelConfigKey[LevelConfigKey["xpMultiplier"] = 4] = "xpMultiplier";
    LevelConfigKey[LevelConfigKey["formula"] = 5] = "formula";
    LevelConfigKey[LevelConfigKey["xpBase"] = 6] = "xpBase";
    LevelConfigKey[LevelConfigKey["xpExponent"] = 7] = "xpExponent";
    LevelConfigKey[LevelConfigKey["maxLevel"] = 8] = "maxLevel";
    LevelConfigKey[LevelConfigKey["stackRoles"] = 9] = "stackRoles";
    LevelConfigKey[LevelConfigKey["noXpRoles"] = 10] = "noXpRoles";
    LevelConfigKey[LevelConfigKey["multipliers"] = 11] = "multipliers";
    LevelConfigKey[LevelConfigKey["roleRewards"] = 12] = "roleRewards";
    LevelConfigKey[LevelConfigKey["messageRewards"] = 13] = "messageRewards";
    LevelConfigKey[LevelConfigKey["notification"] = 14] = "notification";
    LevelConfigKey[LevelConfigKey["ignore"] = 15] = "ignore";
})(LevelConfigKey || (exports.LevelConfigKey = LevelConfigKey = {}));
var XPFormula;
(function (XPFormula) {
    XPFormula[XPFormula["linear"] = 0] = "linear";
    XPFormula[XPFormula["quadratic"] = 1] = "quadratic";
    XPFormula[XPFormula["exponential"] = 2] = "exponential";
})(XPFormula || (exports.XPFormula = XPFormula = {}));
const KEY_NAMES = Object.keys(LevelConfigKey).filter(k => isNaN(Number(k)));
exports.default = new forgescript_1.NativeFunction({
    name: "$setLevelConfig",
    version: "1.0.0",
    description: "Sets a per-guild leveling config value.",
    brackets: true,
    unwrap: true,
    args: [
        {
            name: "key",
            description: "The config key to set.",
            type: forgescript_1.ArgType.Enum,
            enum: LevelConfigKey,
            required: true,
            rest: false,
        },
        {
            name: "value",
            description: "The value to set (parsed as JSON where applicable).",
            type: forgescript_1.ArgType.String,
            required: true,
            rest: false,
        },
        {
            name: "guildID",
            description: "The guild ID. Defaults to current guild.",
            type: forgescript_1.ArgType.Guild,
            required: false,
            rest: false,
        },
    ],
    async execute(ctx, [key, value, guild]) {
        const gid = guild?.id ?? ctx.guild?.id;
        if (!gid)
            return this.customError("Missing guild.");
        const keyName = KEY_NAMES[key];
        // Try to parse as JSON (handles booleans, numbers, etc.)
        let parsed = value;
        try {
            parsed = JSON.parse(value);
        }
        catch { }
        if (keyName === "xpMin" || keyName === "xpMax") {
            const num = Number(parsed);
            if (isNaN(num))
                return this.customError("Value must be a number.");
            const cfg = await LevelsDatabase_1.LevelsDatabase.getConfig(gid);
            const other = keyName === "xpMin" ? (cfg.xpMax ?? 25) : (cfg.xpMin ?? 15);
            if (keyName === "xpMin" && num > other)
                return this.customError("xpMin cannot be greater than xpMax.");
            if (keyName === "xpMax" && num < other)
                return this.customError("xpMax cannot be less than xpMin.");
        }
        await LevelsDatabase_1.LevelsDatabase.patchConfig(gid, keyName, parsed);
        return this.success();
    },
});
//# sourceMappingURL=setLevelConfig.js.map