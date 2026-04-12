"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const LevelsDatabase_1 = require("../../structures/LevelsDatabase");
const setLevelConfig_1 = require("./setLevelConfig");
const KEY_NAMES = Object.keys(setLevelConfig_1.LevelConfigKey).filter(k => isNaN(Number(k)));
exports.default = new forgescript_1.NativeFunction({
    name: "$getLevelConfig",
    version: "1.0.0",
    description: "Gets a per-guild leveling config value.",
    brackets: false,
    unwrap: true,
    output: forgescript_1.ArgType.String,
    args: [
        {
            name: "key",
            description: "The config key to retrieve.",
            type: forgescript_1.ArgType.Enum,
            enum: setLevelConfig_1.LevelConfigKey,
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
    async execute(ctx, [key, guild]) {
        const gid = guild?.id ?? ctx.guild?.id;
        if (!gid)
            return this.customError("Missing guild.");
        const keyName = KEY_NAMES[key];
        const cfg = await LevelsDatabase_1.LevelsDatabase.resolvedConfig(gid);
        const val = cfg[keyName];
        if (val === undefined)
            return this.success("undefined");
        return this.success(typeof val === "object" ? JSON.stringify(val) : String(val));
    },
});
//# sourceMappingURL=getLevelConfig.js.map