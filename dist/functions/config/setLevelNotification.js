"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationType = void 0;
const forgescript_1 = require("@tryforge/forgescript");
const LevelsDatabase_1 = require("../../structures/LevelsDatabase");
var NotificationType;
(function (NotificationType) {
    NotificationType[NotificationType["channel"] = 0] = "channel";
    NotificationType[NotificationType["dm"] = 1] = "dm";
    NotificationType[NotificationType["custom"] = 2] = "custom";
    NotificationType[NotificationType["none"] = 3] = "none";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
exports.default = new forgescript_1.NativeFunction({
    name: "$setLevelNotification",
    version: "1.0.0",
    description: "Configures level-up notification behaviour. type: channel | dm | custom | none",
    brackets: true,
    unwrap: true,
    args: [
        {
            name: "type",
            description: "Notification destination: channel, dm, custom, or none.",
            type: forgescript_1.ArgType.Enum,
            enum: NotificationType,
            required: true,
            rest: false,
        },
        {
            name: "message",
            description: "Template: {user} {level} {oldLevel} {xp} {guild}",
            type: forgescript_1.ArgType.String,
            required: false,
            rest: false,
        },
        {
            name: "channelID",
            description: "Override channel for type=channel.",
            type: forgescript_1.ArgType.Channel,
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
    async execute(ctx, [type, message, channel, guild]) {
        const gid = guild?.id ?? ctx.guild?.id;
        if (!gid)
            return this.customError("Missing guild.");
        const typeNames = ["channel", "dm", "custom", "none"];
        await LevelsDatabase_1.LevelsDatabase.patchConfig(gid, "notification", {
            type: typeNames[type],
            message: message ?? undefined,
            channelId: channel?.id,
        });
        return this.success();
    },
});
//# sourceMappingURL=setLevelNotification.js.map