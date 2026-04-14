"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const eventManager_1 = require("../structures/eventManager");
const __1 = require("..");
const LevelsDatabase_1 = require("../structures/LevelsDatabase");
exports.default = new eventManager_1.LevelsEventHandler({
    name: "levelUp",
    version: "1.0.0",
    description: "Fired when a member levels up",
    listener: async function ({ userId, guildId, oldLevel, newLevel, totalXp, obj }) {
        const ext = this.getExtension(__1.ForgeLevels, true);
        const cfg = await LevelsDatabase_1.LevelsDatabase.resolvedConfig(guildId);
        // ── Role rewards ──────────────────────────────────────────────────────
        const roleRewards = cfg.roleRewards ?? [];
        const guild = this.guilds.cache.get(guildId);
        if (guild) {
            const member = await guild.members.fetch(userId).catch(() => null);
            if (member) {
                // Collect all rewards earned so far (≤ newLevel)
                const earned = roleRewards
                    .filter(r => r.level <= newLevel)
                    .sort((a, b) => b.level - a.level);
                if (cfg.stackRoles) {
                    // Grant all earned roles
                    for (const reward of earned) {
                        if (!member.roles.cache.has(reward.roleId)) {
                            await member.roles.add(reward.roleId).catch(() => null);
                        }
                    }
                }
                else {
                    // Only keep the highest role reward among those earned up to newLevel
                    const highest = earned[0];
                    if (highest) {
                        if (!member.roles.cache.has(highest.roleId)) {
                            await member.roles.add(highest.roleId).catch(() => null);
                        }
                        // Remove all other role rewards (both lower earned ones and higher ones from previous levels)
                        for (const reward of roleRewards) {
                            if (reward.roleId !== highest.roleId && !reward.persistent) {
                                await member.roles.remove(reward.roleId).catch(() => null);
                            }
                        }
                    }
                }
            }
        }
        // ── Message rewards ───────────────────────────────────────────────────
        // Loop through all intermediate levels to ensure no rewards are skipped during bulk XP gain
        for (let l = oldLevel + 1; l <= newLevel; l++) {
            const msgRewards = (cfg.messageRewards ?? []).filter(r => r.level === l);
            for (const reward of msgRewards) {
                ext.emitter.emit("levelReward", { userId, guildId, level: l, label: reward.label, obj });
            }
        }
        // ── Automated Notifications (Issue 3) ─────────────────────────────────
        const notif = cfg.notification;
        if (notif && notif.type && notif.type !== "none") {
            const channel = notif.type === "channel"
                ? (notif.channelId ? await this.channels.fetch(notif.channelId).catch(() => null) : ("send" in obj ? obj : null))
                : null;
            const message = notif.message || "Congratulations {user}, you've reached level {level}!";
            const formatted = message
                .replace("{user}", `<@${userId}>`)
                .replace("{level}", String(newLevel))
                .replace("{xp}", String(totalXp))
                .replace("{guild}", guild?.name || "the server");
            if (notif.type === "dm") {
                const user = await this.users.fetch(userId).catch(() => null);
                await user?.send(formatted).catch(() => null);
            }
            else if (channel && "send" in channel) {
                await channel.send(formatted).catch(() => null);
            }
        }
        // ── Run user-registered levelUp commands ──────────────────────────────
        const commands = ext.commands.get("levelUp");
        for (const command of commands) {
            forgescript_1.Interpreter.run({
                client: this,
                command,
                data: command.compiled.code,
                obj: obj,
                extras: { userId, guildId, oldLevel, newLevel, totalXp },
            });
        }
    },
});
//# sourceMappingURL=levelUp.js.map