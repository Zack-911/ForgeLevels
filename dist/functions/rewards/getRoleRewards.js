"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const LevelsDatabase_1 = require("../../structures/LevelsDatabase");
exports.default = new forgescript_1.NativeFunction({
    name: "$getRoleRewards",
    version: "1.0.0",
    description: "Returns a formatted list of all role rewards configured for this guild.",
    brackets: false,
    unwrap: true,
    output: forgescript_1.ArgType.String,
    args: [
        {
            name: "format",
            description: "Row format. Supports: {level} {roleID} {persistent}. Default: \"Level {level}: <@&{roleID}>\"",
            type: forgescript_1.ArgType.String,
            required: false,
            rest: false,
        },
        {
            name: "separator",
            description: "Row separator (default: newline).",
            type: forgescript_1.ArgType.String,
            required: false,
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
    async execute(ctx, [format, separator, guild]) {
        const gid = guild?.id ?? ctx.guild?.id;
        if (!gid)
            return this.customError("Missing guild.");
        const cfg = await LevelsDatabase_1.LevelsDatabase.getConfig(gid);
        const rewards = (cfg.roleRewards ?? []).sort((a, b) => a.level - b.level);
        if (!rewards.length)
            return this.success("No role rewards configured.");
        const fmt = format ?? "Level {level}: <@&{roleID}>";
        const sep = separator ?? "\n";
        const lines = rewards.map(r => fmt
            .replace("{level}", String(r.level))
            .replace("{roleID}", r.roleId)
            .replace("{persistent}", String(r.persistent ?? true)));
        return this.success(lines.join(sep));
    },
});
//# sourceMappingURL=getRoleRewards.js.map