"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const LevelsDatabase_1 = require("../../structures/LevelsDatabase");
exports.default = new forgescript_1.NativeFunction({
    name: "$removeMessageReward",
    version: "1.0.0",
    description: "Removes a message reward at a level. Optionally filter by label.",
    brackets: true,
    unwrap: true,
    args: [
        { name: "level", type: forgescript_1.ArgType.Number, description: "The level to remove the reward from.", required: true, rest: false },
        { name: "label", type: forgescript_1.ArgType.String, description: "Label to match (optional).", required: false, rest: false },
        { name: "guildID", type: forgescript_1.ArgType.Guild, description: "Guild ID. Defaults to current.", required: false, rest: false },
    ],
    async execute(ctx, [level, label, guild]) {
        const gid = guild?.id ?? ctx.guild?.id;
        if (!gid)
            return this.customError("Missing guild.");
        const cfg = await LevelsDatabase_1.LevelsDatabase.getConfig(gid);
        const rewards = (cfg.messageRewards ?? []).filter(r => {
            if (r.level !== level)
                return true;
            if (label && r.label !== label)
                return true;
            return false;
        });
        await LevelsDatabase_1.LevelsDatabase.patchConfig(gid, "messageRewards", rewards);
        return this.success();
    },
});
//# sourceMappingURL=removeMessageReward.js.map