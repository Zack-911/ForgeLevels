"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const LevelsDatabase_1 = require("../../structures/LevelsDatabase");
exports.default = new forgescript_1.NativeFunction({
    name: "$addRoleReward",
    version: "1.0.0",
    description: "Adds a role reward granted when a member reaches a specific level.",
    brackets: true,
    unwrap: true,
    args: [
        {
            name: "level",
            description: "The level that triggers this reward.",
            type: forgescript_1.ArgType.Number,
            required: true,
            rest: false,
        },
        {
            name: "roleID",
            description: "The role ID to grant.",
            type: forgescript_1.ArgType.Role,
            required: true,
            rest: false,
        },
        {
            name: "persistent",
            description: "Whether to keep this role when surpassing the level (default: true).",
            type: forgescript_1.ArgType.Boolean,
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
    async execute(ctx, [level, role, persistent, guild]) {
        const gid = guild?.id ?? ctx.guild?.id;
        if (!gid)
            return this.customError("Missing guild.");
        if (!role)
            return this.customError("Invalid role.");
        const cfg = await LevelsDatabase_1.LevelsDatabase.getConfig(gid);
        const rewards = cfg.roleRewards ?? [];
        // Remove any existing reward for the same level
        const filtered = rewards.filter(r => r.level !== level);
        filtered.push({ level, roleId: role.id, persistent: persistent ?? true });
        await LevelsDatabase_1.LevelsDatabase.patchConfig(gid, "roleRewards", filtered);
        return this.success();
    },
});
//# sourceMappingURL=addRoleReward.js.map