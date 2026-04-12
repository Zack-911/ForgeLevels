"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const LevelsDatabase_1 = require("../../structures/LevelsDatabase");
const XpFormula_1 = require("../../structures/XpFormula");
exports.default = new forgescript_1.NativeFunction({
    name: "$removeXp",
    version: "1.0.0",
    description: "Removes XP from a member (floor: 0). Recalculates their level.",
    brackets: true,
    unwrap: true,
    args: [
        {
            name: "xp",
            description: "Amount of XP to remove.",
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
    async execute(ctx, [xp, userId, guild]) {
        const uid = userId ?? ctx.user?.id;
        const gid = guild?.id ?? ctx.guild?.id;
        if (!uid || !gid)
            return this.customError("Missing user or guild.");
        const record = await LevelsDatabase_1.LevelsDatabase.getOrCreate(gid, uid);
        const cfg = await LevelsDatabase_1.LevelsDatabase.resolvedConfig(gid);
        record.xp = Math.max(0, record.xp - xp);
        record.level = (0, XpFormula_1.levelFromXp)(record.xp, cfg).level;
        await LevelsDatabase_1.LevelsDatabase.setMember(record);
        return this.success();
    },
});
//# sourceMappingURL=removeXp.js.map