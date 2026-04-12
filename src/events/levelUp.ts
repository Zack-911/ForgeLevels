import { Interpreter } from "@tryforge/forgescript"
import { LevelsEventHandler } from "../structures/eventManager"
import { ForgeLevels } from ".."
import { LevelsDatabase } from "../structures/LevelsDatabase"

export default new LevelsEventHandler({
    name: "levelUp",
    version: "1.0.0",
    description: "Fired when a member levels up",
    listener: async function ({ userId, guildId, oldLevel, newLevel, totalXp }) {
        const ext = this.getExtension(ForgeLevels, true)
        const cfg = await LevelsDatabase.resolvedConfig(guildId)

        // ── Role rewards ──────────────────────────────────────────────────────
        const roleRewards = cfg.roleRewards ?? []
        const guild = this.guilds.cache.get(guildId)
        if (guild) {
            const member = await guild.members.fetch(userId).catch(() => null)
            if (member) {
                // Collect all rewards earned so far (≤ newLevel)
                const earned = roleRewards
                    .filter(r => r.level <= newLevel)
                    .sort((a, b) => b.level - a.level)

                if (cfg.stackRoles) {
                    // Grant all earned roles
                    for (const reward of earned) {
                        if (!member.roles.cache.has(reward.roleId)) {
                            await member.roles.add(reward.roleId).catch(() => null)
                        }
                    }
                } else {
                    // Only keep the highest role reward; remove lower ones
                    const [highest, ...lower] = earned
                    if (highest) {
                        await member.roles.add(highest.roleId).catch(() => null)
                        for (const r of lower) {
                            await member.roles.remove(r.roleId).catch(() => null)
                        }
                    }
                }

                // Remove roles from rewards at levels the member has surpassed
                // (only if not persistent)
                for (const reward of roleRewards) {
                    if (!reward.persistent && reward.level < newLevel && !cfg.stackRoles) {
                        await member.roles.remove(reward.roleId).catch(() => null)
                    }
                }
            }
        }

        // ── Message rewards ───────────────────────────────────────────────────
        const msgRewards = (cfg.messageRewards ?? []).filter(r => r.level === newLevel)
        for (const reward of msgRewards) {
            ext.emitter.emit("levelReward", { userId, guildId, level: newLevel, label: reward.label })
        }

        // ── Auto-notification ─────────────────────────────────────────────────
        const notifCfg = cfg.notification ?? {}
        const notifType = notifCfg.type ?? ext.options.defaultNotification ?? "channel"
        const template = notifCfg.message ?? ext.options.defaultMessage ??
            "🎉 {user} just reached level **{level}**!"

        const message = template
            .replace("{user}", `<@${userId}>`)
            .replace("{level}", String(newLevel))
            .replace("{oldLevel}", String(oldLevel))
            .replace("{xp}", String(totalXp))
            .replace("{guild}", guild?.name ?? guildId)

        if (ext.options.autoNotify && notifType !== "none" && notifType !== "custom") {
            if (notifType === "dm") {
                const user = await this.users.fetch(userId).catch(() => null)
                if (user) await user.send(message).catch(() => null)
            } else if (notifType === "channel") {
                // notifCfg.channelId = override channel, otherwise we need the
                // event to come from a channel — stored in levelUp payload context.
                // We emit to a fixed channel if configured.
                const channelId = notifCfg.channelId
                if (channelId) {
                    const channel = this.channels.cache.get(channelId)
                    if (channel?.isTextBased()) {
                        await (channel as any).send(message).catch(() => null)
                    }
                }
                // If no channel override the xpGain event handles sending in-channel
            }
        }

        // ── Run user-registered levelUp commands ──────────────────────────────
        const commands = ext.commands.get("levelUp")
        for (const command of commands) {
            Interpreter.run({
                client: this,
                command,
                data: command.compiled.code,
                obj: {},
                extras: { userId, guildId, oldLevel, newLevel, totalXp },
            })
        }
    },
})
