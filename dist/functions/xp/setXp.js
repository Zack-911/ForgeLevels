"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const LevelsDatabase_1 = require("../../structures/LevelsDatabase");
const XpFormula_1 = require("../../structures/XpFormula");
exports.default = new forgescript_1.NativeFunction({
    name: "$setXp",
    version: "1.0.0",
    description: "Sets a member's total XP directly, recalculating their level.",
    brackets: true,
    unwrap: true,
    args: [
        {
            name: "xp",
            description: "The XP value to set.",
            type: forgescript_1.ArgType.Number,
            required: true,
            rest: false,
        },
        {
            name: "userID",
            description: "The user ID. Defaults to the command author.",
            type: forgescript_1.ArgType.String,
            required: false,
            rest: false,
        },
        {
            name: "guildID",
            description: "The guild ID. Defaults to the current guild.",
            type: forgescript_1.ArgType.Guild,
            required: false,
            rest: false,
        },
    ],
    async execute(ctx, [xp, userId, guild]) {
        const uid = userId ?? ctx.user?.id;
        const gid = guild?.id ?? ctx.guild?.id;
        if (!uid || !gid)
            return this.customError("Missing user or guild.");
        const record = await LevelsDatabase_1.LevelsDatabase.getOrCreate(gid, uid);
        const cfg = await LevelsDatabase_1.LevelsDatabase.resolvedConfig(gid);
        record.xp = Math.max(0, xp);
        record.level = (0, XpFormula_1.levelFromXp)(record.xp, cfg).level;
        await LevelsDatabase_1.LevelsDatabase.setMember(record);
        return this.success();
    },
});
//# sourceMappingURL=setXp.js.map