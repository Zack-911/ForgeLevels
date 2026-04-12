"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const LevelsDatabase_1 = require("../../structures/LevelsDatabase");
exports.default = new forgescript_1.NativeFunction({
    name: "$resetGuildLevels",
    version: "1.0.0",
    description: "Wipes ALL leveling data (XP, levels, messages) for every member in this guild.",
    brackets: false,
    unwrap: true,
    args: [
        {
            name: "guildID",
            description: "The guild ID. Defaults to current guild.",
            type: forgescript_1.ArgType.Guild,
            required: false,
            rest: false,
        },
    ],
    async execute(ctx, [guild]) {
        const gid = guild?.id ?? ctx.guild?.id;
        if (!gid)
            return this.customError("Missing guild.");
        await LevelsDatabase_1.LevelsDatabase.resetGuild(gid);
        return this.success();
    },
});
//# sourceMappingURL=resetGuildLevels.js.map