"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const LevelsDatabase_1 = require("../../structures/LevelsDatabase");
exports.default = new forgescript_1.NativeFunction({
    name: "$getLevel",
    version: "1.0.0",
    description: "Returns a member's current level.",
    brackets: false,
    unwrap: true,
    output: forgescript_1.ArgType.Number,
    args: [
        {
            name: "userID",
            description: "The user ID. Defaults to command author.",
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
    async execute(ctx, [userId, guild]) {
        const uid = userId ?? ctx.user?.id;
        const gid = guild?.id ?? ctx.guild?.id;
        if (!uid || !gid)
            return this.customError("Missing user or guild.");
        const record = await LevelsDatabase_1.LevelsDatabase.getMember(gid, uid);
        return this.success(record?.level ?? 0);
    },
});
//# sourceMappingURL=getLevel.js.map