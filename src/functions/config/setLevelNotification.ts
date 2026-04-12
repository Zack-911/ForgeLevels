import { ArgType, NativeFunction } from "@tryforge/forgescript"
import { LevelsDatabase } from "../../structures/LevelsDatabase"

export enum NotificationType {
    channel,
    dm,
    custom,
    none,
}

export default new NativeFunction({
    name: "$setLevelNotification",
    version: "1.0.0",
    description: "Configures level-up notification behaviour. type: channel | dm | custom | none",
    brackets: true,
    unwrap: true,
    args: [
        {
            name: "type",
            description: "Notification destination: channel, dm, custom, or none.",
            type: ArgType.Enum,
            enum: NotificationType,
            required: true,
            rest: false,
        },
        {
            name: "message",
            description: "Template: {user} {level} {oldLevel} {xp} {guild}",
            type: ArgType.String,
            required: false,
            rest: false,
        },
        {
            name: "channelID",
            description: "Override channel for type=channel.",
            type: ArgType.Channel,
            required: false,
            rest: false,
        },
        {
            name: "guildID",
            description: "The guild ID. Defaults to current guild.",
            type: ArgType.Guild,
            required: false,
            rest: false,
        },
    ],
    async execute(ctx, [type, message, channel, guild]) {
        const gid = guild?.id ?? ctx.guild?.id
        if (!gid) return this.customError("Missing guild.")

        const typeNames = ["channel", "dm", "custom", "none"] as const
        await LevelsDatabase.patchConfig(gid, "notification", {
            type: typeNames[type],
            message: message ?? undefined,
            channelId: channel?.id,
        })
        return this.success()
    },
})
