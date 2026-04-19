"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const eventManager_1 = require("../structures/eventManager");
const __1 = require("..");
const LevelsDatabase_1 = require("../structures/LevelsDatabase");
exports.default = new eventManager_1.LevelsEventHandler({
    name: "levelDown",
    version: "1.0.0",
    description: "Fired when a member levels down",
    listener: async function ({ userId, guildId, oldLevel, newLevel, totalXp, obj }) {
        const ext = this.getExtension(__1.ForgeLevels, true);
        const cfg = await LevelsDatabase_1.LevelsDatabase.resolvedConfig(guildId);
        // ── Role rewards ──────────────────────────────────────────────────────
        const roleRewards = cfg.roleRewards ?? [];
        const guild = this.guilds.cache.get(guildId);
        if (guild) {
            const member = await guild.members.fetch(userId).catch(() => null);
            if (member) {
                // Roles that should NOT be owned anymore (> newLevel)
                const lost = roleRewards.filter(r => r.level > newLevel);
                // Roles still valid (≤ newLevel)
                const remaining = roleRewards
                    .filter(r => r.level <= newLevel)
                    .sort((a, b) => b.level - a.level);
                if (cfg.stackRoles) {
                    // Remove roles above new level
                    for (const reward of lost) {
                        if (member.roles.cache.has(reward.roleId) && !reward.persistent) {
                            await member.roles.remove(reward.roleId).catch(() => null);
                        }
                    }
                }
                else {
                    // Keep only highest valid role
                    const highest = remaining[0];
                    // Remove all level roles first (non-persistent)
                    for (const reward of roleRewards) {
                        if (!reward.persistent && member.roles.cache.has(reward.roleId)) {
                            await member.roles.remove(reward.roleId).catch(() => null);
                        }
                    }
                    // Re-add the correct one if it exists
                    if (highest && !member.roles.cache.has(highest.roleId)) {
                        await member.roles.add(highest.roleId).catch(() => null);
                    }
                }
            }
        }
        // ── Run user-registered levelDown commands ────────────────────────────
        const commands = ext.commands.get("levelDown");
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
//# sourceMappingURL=levelDown.js.map