"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const LevelsDatabase_1 = require("../../structures/LevelsDatabase");
const XpFormula_1 = require("../../structures/XpFormula");
exports.default = new forgescript_1.NativeFunction({
    name: "$setLevel",
    version: "1.0.0",
    description: "Sets a member's level, adjusting their XP to the base of that level.",
    brackets: true,
    unwrap: true,
    args: [
        {
            name: "level",
            description: "The level to set.",
            type: forgescript_1.ArgType.Number,
            required: true,
            rest: false,
        },
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
    async execute(ctx, [level, userId, guild]) {
        const uid = userId ?? ctx.user?.id;
        const gid = guild?.id ?? ctx.guild?.id;
        if (!uid || !gid)
            return this.customError("Missing user or guild.");
        const cfg = await LevelsDatabase_1.LevelsDatabase.resolvedConfig(gid);
        const record = await LevelsDatabase_1.LevelsDatabase.getOrCreate(gid, uid);
        record.level = Math.max(0, level);
        record.xp = (0, XpFormula_1.totalXpForLevel)(record.level, cfg);
        await LevelsDatabase_1.LevelsDatabase.setMember(record);
        return this.success();
    },
});
//# sourceMappingURL=setLevel.js.map