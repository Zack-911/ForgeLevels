"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const LevelsDatabase_1 = require("../../structures/LevelsDatabase");
const XpFormula_1 = require("../../structures/XpFormula");
const __1 = require("../..");
exports.default = new forgescript_1.NativeFunction({
    name: "$addXp",
    version: "1.0.0",
    description: "Manually adds XP to a member, triggering levelUp if applicable.",
    brackets: true,
    unwrap: true,
    args: [
        {
            name: "xp",
            description: "Amount of XP to add.",
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
        const cfg = await LevelsDatabase_1.LevelsDatabase.resolvedConfig(gid);
        const record = await LevelsDatabase_1.LevelsDatabase.getOrCreate(gid, uid);
        const oldLevel = (0, XpFormula_1.levelFromXp)(record.xp, cfg).level;
        record.xp = Math.max(0, record.xp + xp);
        record.level = (0, XpFormula_1.levelFromXp)(record.xp, cfg).level;
        record.lastXpAt = Date.now(); // Update cooldown (Issue 15)
        await LevelsDatabase_1.LevelsDatabase.setMember(record);
        const ext = ctx.client.getExtension(__1.ForgeLevels, true);
        // Only emit xpGain if XP is positive (Issue 9)
        if (xp > 0) {
            ext.emitter.emit("xpGain", { userId: uid, guildId: gid, xp, totalXp: record.xp, obj: ctx.obj });
        }
        if (record.level > oldLevel) {
            ext.emitter.emit("levelUp", {
                userId: uid,
                guildId: gid,
                oldLevel,
                newLevel: record.level,
                totalXp: record.xp,
                obj: ctx.obj
            });
        }
        return this.success();
    },
});
//# sourceMappingURL=addXp.js.map