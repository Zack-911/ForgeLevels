import { Entity, Column, PrimaryColumn, ObjectIdColumn } from "typeorm"
import { Snowflake } from "discord.js"

/**
 * SQLite / MySQL / PostgreSQL record for a member's leveling data.
 */
@Entity("forge_levels")
export class LevelRecord {
    /** Composite key: guildId_userId */
    @PrimaryColumn()
    public identifier!: string

    /** The guild this record belongs to */
    @Column()
    public guildId!: Snowflake

    /** The user this record belongs to */
    @Column()
    public userId!: Snowflake

    /** Total accumulated XP */
    @Column({ default: 0 })
    public xp!: number

    /** Current level (derived from xp but cached for fast leaderboard queries) */
    @Column({ default: 0 })
    public level!: number

    /** Total messages sent (used for stats) */
    @Column({ default: 0 })
    public totalMessages!: number

    /** Unix timestamp (ms) of the last XP gain — used for cooldown enforcement */
    @Column({ default: 0 })
    public lastXpAt!: number
}

/**
 * MongoDB variant of the LevelRecord.
 */
@Entity("forge_levels")
export class MongoLevelRecord extends LevelRecord {
    @ObjectIdColumn()
    public mongoId?: string
}

/**
 * Per-guild configuration stored as a JSON blob.
 */
@Entity("forge_levels_config")
export class GuildConfig {
    /** The guild ID — primary key */
    @PrimaryColumn()
    public guildId!: Snowflake

    /**
     * Serialized JSON of ILevelConfig.
     * Stored as a string so it works across all DB adapters.
     */
    @Column({ type: "text", default: "{}" })
    public config!: string
}

/**
 * MongoDB variant of GuildConfig.
 */
@Entity("forge_levels_config")
export class MongoGuildConfig extends GuildConfig {
    @ObjectIdColumn()
    public mongoId?: string
}
