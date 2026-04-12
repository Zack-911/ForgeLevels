"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const LevelsDatabase_1 = require("../../structures/LevelsDatabase");
exports.default = new forgescript_1.NativeFunction({
    name: "$leaderboardSize",
    version: "1.0.0",
    description: "Returns the total number of ranked members in the guild.",
    brackets: false,
    unwrap: true,
    output: forgescript_1.ArgType.Number,
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
        return this.success(await LevelsDatabase_1.LevelsDatabase.getTotalMembers(gid));
    },
});
//# sourceMappingURL=leaderboardSize.js.map