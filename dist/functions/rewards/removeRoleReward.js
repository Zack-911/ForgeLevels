"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const LevelsDatabase_1 = require("../../structures/LevelsDatabase");
exports.default = new forgescript_1.NativeFunction({
    name: "$removeRoleReward",
    version: "1.0.0",
    description: "Removes the role reward configured at a specific level.",
    brackets: true,
    unwrap: true,
    args: [
        {
            name: "level",
            description: "The level whose reward should be removed.",
            type: forgescript_1.ArgType.Number,
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
    async execute(ctx, [level, guild]) {
        const gid = guild?.id ?? ctx.guild?.id;
        if (!gid)
            return this.customError("Missing guild.");
        const cfg = await LevelsDatabase_1.LevelsDatabase.getConfig(gid);
        const rewards = (cfg.roleRewards ?? []).filter(r => r.level !== level);
        await LevelsDatabase_1.LevelsDatabase.patchConfig(gid, "roleRewards", rewards);
        return this.success();
    },
});
//# sourceMappingURL=removeRoleReward.js.map