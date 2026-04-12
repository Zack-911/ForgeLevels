"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const LevelsDatabase_1 = require("../../structures/LevelsDatabase");
exports.default = new forgescript_1.NativeFunction({
    name: "$setCooldown",
    version: "1.0.0",
    description: "Set the time between each message for XP to be counted.",
    brackets: true,
    unwrap: true,
    args: [
        {
            name: "time",
            description: "The time to set it as.",
            type: forgescript_1.ArgType.Time,
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
    async execute(ctx, [time, guild]) {
        const gid = guild?.id ?? ctx.guild?.id;
        if (!gid)
            return this.customError("Missing guild.");
        await LevelsDatabase_1.LevelsDatabase.patchConfig(gid, "xpCooldown", time);
        return this.success();
    },
});
//# sourceMappingURL=setCooldown.js.map