import { ForgeLevels } from ".."
import { LevelsDatabase } from "../structures/LevelsDatabase"
import { levelFromXp } from "../structures/XpFormula"
import { Message } from "discord.js"

/**
 * This is the heart of ForgeLevels.
 * Listens to every messageCreate, counts all messages, enforces cooldown,
 * awards XP, detects level-ups, and fires the appropriate events.
 */
export async function handleMessage(
    message: Message,
    ext: ForgeLevels
): Promise<void> {
    if (!message.guild || !message.author) return
    if (message.author.bot) return
    if (message.webhookId) return

    // ── Ignore commands ───────────────────────────────────────────────────────
    // client.options.prefixes is IExtendedCompilationResult[], NOT string[].
    // Use getPrefix() which properly evaluates the compiled prefix expressions.
    const prefix = await ext.client.getPrefix(message)
    if (prefix !== null) return

    const guildId = message.guild.id
    const userId = message.author.id

    const cfg = await LevelsDatabase.resolvedConfig(guildId)
    if (!cfg.enabled) return

    const ignore = cfg.ignore ?? {}
    if (ignore.channelIds?.includes(message.channelId)) return
    if (ignore.userIds?.includes(userId)) return

    const memberRoles = message.member?.roles.cache.map(r => r.id) ?? []
    if (ignore.roleIds?.some(r => memberRoles.includes(r))) return

    // ── Pre-fetch record ──────────────────────────────────────────────────────
    const record = await LevelsDatabase.getOrCreate(guildId, userId)
    const now = Date.now()

    // ── Cooldown check ────────────────────────────────────────────────────────
    const onCooldown = now - record.lastXpAt < cfg.xpCooldown
    if (onCooldown) {
        // Atomic increment only — avoids overwriting XP if a concurrent addXp ran
        await LevelsDatabase.addMessage(guildId, userId)
        return
    }

    // ── No-XP roles (counts as message, but no XP) ────────────────────────────
    if (cfg.noXpRoles?.some(r => memberRoles.includes(r))) {
        await LevelsDatabase.addMessage(guildId, userId)
        return
    }

    // ── Calculate XP ──────────────────────────────────────────────────────────
    let xpGained = Math.floor(
        Math.random() * (cfg.xpMax - cfg.xpMin + 1) + cfg.xpMin
    )

    let multiplier = cfg.xpMultiplier
    for (const m of cfg.multipliers ?? []) {
        if (m.roleId && memberRoles.includes(m.roleId)) multiplier *= m.multiplier
        if (m.channelId && m.channelId === message.channelId) multiplier *= m.multiplier
    }

    xpGained = Math.floor(xpGained * multiplier)
    if (xpGained <= 0) {
        await LevelsDatabase.addMessage(guildId, userId)
        return
    }

    // ── Level-up detection ────────────────────────────────────────────────────
    const oldLevelData = levelFromXp(record.xp, cfg)

    if (cfg.maxLevel > 0 && oldLevelData.level >= cfg.maxLevel) {
        await LevelsDatabase.addMessage(guildId, userId)
        return
    }

    const newTotalXp = record.xp + xpGained
    const newLevelData = levelFromXp(newTotalXp, cfg)

    // ── Persist (Full update including XP and level) ──────────────────────────
    record.xp = newTotalXp
    record.level = newLevelData.level
    record.totalMessages += 1
    record.lastXpAt = now
    await LevelsDatabase.setMember(record)

    // ── Emit events ───────────────────────────────────────────────────────────
    ext.emitter.emit("xpGain", { userId, guildId, xp: xpGained, totalXp: newTotalXp, obj: message })

    if (newLevelData.level > oldLevelData.level) {
        ext.emitter.emit("levelUp", {
            userId,
            guildId,
            oldLevel: oldLevelData.level,
            newLevel: newLevelData.level,
            totalXp: newTotalXp,
            obj: message,
        })
    }
}