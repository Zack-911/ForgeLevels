"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const LevelsDatabase_1 = require("../../structures/LevelsDatabase");
exports.default = new forgescript_1.NativeFunction({
    name: "$addXpMultiplier",
    version: "1.0.0",
    description: "Adds an XP multiplier for a role or channel. Supply roleID or channelID (or both).",
    brackets: true,
    unwrap: true,
    args: [
        {
            name: "multiplier",
            description: "The multiplier value (e.g. 2 = double XP).",
            type: forgescript_1.ArgType.Number,
            required: true,
            rest: false,
        },
        {
            name: "roleID",
            description: "Role ID that triggers this multiplier. Leave empty to skip.",
            type: forgescript_1.ArgType.Role,
            required: false,
            rest: false,
        },
        {
            name: "channelID",
            description: "Channel ID that triggers this multiplier. Leave empty to skip.",
            type: forgescript_1.ArgType.Channel,
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
    async execute(ctx, [multiplier, role, channel, guild]) {
        const gid = guild?.id ?? ctx.guild?.id;
        if (!gid)
            return this.customError("Missing guild.");
        if (!role && !channel)
            return this.customError("Supply at least a roleID or channelID.");
        const cfg = await LevelsDatabase_1.LevelsDatabase.getConfig(gid);
        const multipliers = cfg.multipliers ?? [];
        multipliers.push({
            multiplier,
            roleId: role?.id,
            channelId: channel?.id,
        });
        await LevelsDatabase_1.LevelsDatabase.patchConfig(gid, "multipliers", multipliers);
        return this.success();
    },
});
//# sourceMappingURL=addXpMultiplier.js.map