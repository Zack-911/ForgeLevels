"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const LevelsDatabase_1 = require("../../structures/LevelsDatabase");
exports.default = new forgescript_1.NativeFunction({
    name: "$addMessageReward",
    version: "1.0.0",
    description: "Adds a custom reward label at a specific level. Fires the levelReward event.",
    brackets: true,
    unwrap: true,
    args: [
        { name: "level", type: forgescript_1.ArgType.Number, description: "The level that triggers this reward.", required: true, rest: false },
        { name: "label", type: forgescript_1.ArgType.String, description: "A name/label for this reward.", required: true, rest: false },
        { name: "guildID", type: forgescript_1.ArgType.Guild, description: "Guild ID. Defaults to current.", required: false, rest: false },
    ],
    async execute(ctx, [level, label, guild]) {
        const gid = guild?.id ?? ctx.guild?.id;
        if (!gid)
            return this.customError("Missing guild.");
        const cfg = await LevelsDatabase_1.LevelsDatabase.getConfig(gid);
        const rewards = cfg.messageRewards ?? [];
        rewards.push({ level, label });
        await LevelsDatabase_1.LevelsDatabase.patchConfig(gid, "messageRewards", rewards);
        return this.success();
    },
});
//# sourceMappingURL=addMessageReward.js.map