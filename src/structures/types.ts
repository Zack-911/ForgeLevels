import { Snowflake } from "discord.js"

// ─── XP Formula Types ─────────────────────────────────────────────────────────

/** Built-in formulas for calculating how much XP is required to reach a level */
export type XPFormula =
    | "linear"       // xpRequired = base * level
    | "quadratic"    // xpRequired = base * level^2
    | "exponential"  // xpRequired = base * multiplier^level

// ─── Reward Types ─────────────────────────────────────────────────────────────

/** A role reward granted when reaching a specific level */
export interface IRoleReward {
    /** The level that triggers this reward */
    level: number
    /** The role ID to grant */
    roleId: Snowflake
    /** Whether to remove the role when surpassing this level (role stacking vs singular) */
    persistent?: boolean
}

/** An arbitrary message-based reward (fires the levelReward event) */
export interface IMessageReward {
    level: number
    /** A label / name for this reward — e.g. "Mystery Box" */
    label: string
}

// ─── Multiplier Types ─────────────────────────────────────────────────────────

export interface IMultiplier {
    /** Applies the multiplier when the user has this role */
    roleId?: Snowflake
    /** Applies the multiplier when the message is sent in this channel */
    channelId?: Snowflake
    /** The XP multiplier value (e.g. 2 = double XP) */
    multiplier: number
}

// ─── Ignored Entities ────────────────────────────────────────────────────────

export interface IIgnoreConfig {
    /** Channel IDs where XP will NOT be awarded */
    channelIds?: Snowflake[]
    /** Role IDs whose members will NOT earn XP */
    roleIds?: Snowflake[]
    /** User IDs that will NOT earn XP */
    userIds?: Snowflake[]
    /** Whether bots should be ignored (default: true) */
    ignoreBots?: boolean
}

// ─── Notification Config ──────────────────────────────────────────────────────

export type LevelUpNotification =
    | "dm"       // Send a DM to the user
    | "channel"  // Send in the channel where the message was sent
    | "custom"   // Fire the levelUp event only; extension user handles it
    | "none"     // Silent — no automatic message, only event

export interface INotificationConfig {
    /** Where to send level-up messages */
    type?: LevelUpNotification
    /** If type is "channel", override with a specific channel ID */
    channelId?: Snowflake
    /**
     * The level-up message template.
     * Supports: {user} {level} {xp} {nextLevelXp} {guild}
     */
    message?: string
}

// ─── Full Guild Config ────────────────────────────────────────────────────────

export interface ILevelConfig {
    /**
     * Whether the leveling system is enabled for this guild.
     * Default: true
     */
    enabled?: boolean

    // ── XP Settings ───────────────────────────────────────────────────────────

    /** Minimum XP awarded per message. Default: 15 */
    xpMin?: number
    /** Maximum XP awarded per message. Default: 25 */
    xpMax?: number

    /**
     * Cooldown between XP gains in milliseconds.
     * Default: 60000 (60 seconds)
     */
    xpCooldown?: number

    /**
     * Global XP multiplier applied on top of any role/channel multipliers.
     * Default: 1
     */
    xpMultiplier?: number

    /**
     * Role/channel-specific XP multipliers.
     * All matching multipliers are stacked (multiplied together).
     */
    multipliers?: IMultiplier[]

    // ── Level Formula ─────────────────────────────────────────────────────────

    /** XP formula to use for computing required XP per level. Default: "quadratic" */
    formula?: XPFormula

    /**
     * Base XP value used in the formula.
     * linear:      xpRequired = base * level
     * quadratic:   xpRequired = base * level^2
     * exponential: xpRequired = base * exponent^level
     * Default: 100
     */
    xpBase?: number

    /**
     * Exponent used only for the "exponential" formula.
     * xpRequired = xpBase * xpExponent^level
     * Default: 1.5
     */
    xpExponent?: number

    // ── Level Cap ─────────────────────────────────────────────────────────────

    /** Maximum level a member can reach. 0 = no cap. Default: 0 */
    maxLevel?: number

    // ── Rewards ───────────────────────────────────────────────────────────────

    /** Role rewards granted at specific levels */
    roleRewards?: IRoleReward[]

    /** Message/custom rewards that fire the levelReward event */
    messageRewards?: IMessageReward[]

    // ── Notifications ─────────────────────────────────────────────────────────

    notification?: INotificationConfig

    // ── Ignore Lists ──────────────────────────────────────────────────────────

    ignore?: IIgnoreConfig

    // ── Stack Mode ────────────────────────────────────────────────────────────

    /**
     * If true, all earned role rewards are kept as the member levels up.
     * If false, only the highest reward role is kept.
     * Default: true
     */
    stackRoles?: boolean

    // ── No-XP Roles ───────────────────────────────────────────────────────────

    /**
     * Roles that grant zero XP but are not the same as ignore.
     * Members with these roles can still appear on the leaderboard.
     */
    noXpRoles?: Snowflake[]
}

// ─── Default Config ───────────────────────────────────────────────────────────

export const DEFAULT_CONFIG: Required<
    Pick<ILevelConfig,
        "enabled" | "xpMin" | "xpMax" | "xpCooldown" | "xpMultiplier" |
        "formula" | "xpBase" | "xpExponent" | "maxLevel" | "stackRoles"
    >
> = {
    enabled: true,
    xpMin: 15,
    xpMax: 25,
    xpCooldown: 60_000,
    xpMultiplier: 1,
    formula: "quadratic",
    xpBase: 100,
    xpExponent: 1.5,
    maxLevel: 0,
    stackRoles: true,
}
