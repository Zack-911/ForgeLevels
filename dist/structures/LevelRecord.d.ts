import { Snowflake } from "discord.js";
/**
 * SQLite / MySQL / PostgreSQL record for a member's leveling data.
 */
export declare class LevelRecord {
    /** Composite key: guildId_userId */
    identifier: string;
    /** The guild this record belongs to */
    guildId: Snowflake;
    /** The user this record belongs to */
    userId: Snowflake;
    /** Total accumulated XP */
    xp: number;
    /** Current level (derived from xp but cached for fast leaderboard queries) */
    level: number;
    /** Total messages sent (used for stats) */
    totalMessages: number;
    /** Unix timestamp (ms) of the last XP gain — used for cooldown enforcement */
    lastXpAt: number;
}
/**
 * MongoDB variant of the LevelRecord.
 */
export declare class MongoLevelRecord extends LevelRecord {
    mongoId?: string;
}
/**
 * Per-guild configuration stored as a JSON blob.
 */
export declare class GuildConfig {
    /** The guild ID — primary key */
    guildId: Snowflake;
    /**
     * Serialized JSON of ILevelConfig.
     * Stored as a string so it works across all DB adapters.
     */
    config: string;
}
/**
 * MongoDB variant of GuildConfig.
 */
export declare class MongoGuildConfig extends GuildConfig {
    mongoId?: string;
}
//# sourceMappingURL=LevelRecord.d.ts.map