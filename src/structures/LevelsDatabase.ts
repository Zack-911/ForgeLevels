import "reflect-metadata"
import { DataSource, MixedList, EntitySchema } from "typeorm"
import { DataBaseManager } from "@tryforge/forge.db"
import { Snowflake } from "discord.js"
import {
    GuildConfig, LevelRecord,
    MongoGuildConfig, MongoLevelRecord,
} from "./LevelRecord"
import { ILevelConfig, DEFAULT_CONFIG } from "./types"

// ─── Abstract base (mirrors GiveawaysDatabaseManager) ────────────────────────

export abstract class LevelsDatabaseManager extends DataBaseManager {
    constructor() { super() }
}

// ─── Concrete DB class ────────────────────────────────────────────────────────

export class LevelsDatabase extends LevelsDatabaseManager {
    public database = "forge.levels.db"

    public entityManager: {
        sqlite: MixedList<Function | string | EntitySchema>
        mongodb: MixedList<Function | string | EntitySchema>
        mysql: MixedList<Function | string | EntitySchema>
        postgres: MixedList<Function | string | EntitySchema>
    } = {
        sqlite: [LevelRecord, GuildConfig],
        mongodb: [MongoLevelRecord, MongoGuildConfig],
        mysql: [LevelRecord, GuildConfig],
        postgres: [LevelRecord, GuildConfig],
    }

    private static db: DataSource
    private db: Promise<DataSource>

    private static RecordEntity: typeof LevelRecord | typeof MongoLevelRecord
    private static ConfigEntity: typeof GuildConfig | typeof MongoGuildConfig

    // Config cache — reduces DB hits for every message
    private static configCache = new Map<Snowflake, ILevelConfig>()

    constructor() {
        super()
        this.type ??= "sqlite"
        this.db = this.getDB()

        const isMongo = this.type === "mongodb"
        LevelsDatabase.RecordEntity = isMongo ? MongoLevelRecord : LevelRecord
        LevelsDatabase.ConfigEntity = isMongo ? MongoGuildConfig : GuildConfig
    }

    public async init() {
        LevelsDatabase.db = await this.db
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    private static makeId(guildId: Snowflake, userId: Snowflake) {
        return `${guildId}_${userId}`
    }

    // ── Member record CRUD ────────────────────────────────────────────────────

    public static async getMember(guildId: Snowflake, userId: Snowflake) {
        return await this.db
            .getRepository(this.RecordEntity)
            .findOneBy({ identifier: this.makeId(guildId, userId) }) ?? null
    }

    public static async setMember(record: LevelRecord) {
        if (this.type === "mongodb") {
            const old = await this.getMember(record.guildId, record.userId)
            if (old) {
                await this.db.getRepository(this.RecordEntity).update(old.identifier, record)
                return
            }
        }
        await this.db.getRepository(this.RecordEntity).save(record)
    }

    /** Atomically increments the message count for a member. */
    public static async addMessage(guildId: Snowflake, userId: Snowflake) {
        const identifier = this.makeId(guildId, userId)
        // Ensure record exists first
        await this.getOrCreate(guildId, userId)
        
        await this.db.getRepository(this.RecordEntity).increment({ identifier }, "totalMessages", 1)
    }

    public static async deleteMember(guildId: Snowflake, userId: Snowflake) {
        return await this.db
            .getRepository(this.RecordEntity)
            .delete({ identifier: this.makeId(guildId, userId) })
    }

    /** Creates a fresh LevelRecord with the composite identifier set */
    public static makeFreshRecord(guildId: Snowflake, userId: Snowflake): LevelRecord {
        const rec = new LevelRecord()
        rec.identifier = this.makeId(guildId, userId)
        rec.guildId = guildId
        rec.userId = userId
        rec.xp = 0
        rec.level = 0
        rec.totalMessages = 0
        rec.lastXpAt = 0
        return rec
    }

    /** Gets or creates a member record */
    public static async getOrCreate(guildId: Snowflake, userId: Snowflake): Promise<LevelRecord> {
        return (await this.getMember(guildId, userId)) ?? this.makeFreshRecord(guildId, userId)
    }

    // ── Leaderboard ───────────────────────────────────────────────────────────

    public static async getLeaderboard(
        guildId: Snowflake,
        page = 1,
        perPage = 10,
        sortBy: 0 | 1 | 2 = 0  // 0=xp, 1=level, 2=totalMessages
    ): Promise<LevelRecord[]> {
        const orderField = sortBy === 1 ? "level" : sortBy === 2 ? "totalMessages" : "xp"
        return await this.db
            .getRepository(this.RecordEntity)
            .find({
                where: { guildId },
                order: { [orderField]: "DESC" },
                skip: (page - 1) * perPage,
                take: perPage,
            })
    }

    public static async getTotalMembers(guildId: Snowflake): Promise<number> {
        return await this.db
            .getRepository(this.RecordEntity)
            .countBy({ guildId })
    }

    public static async getRank(guildId: Snowflake, userId: Snowflake): Promise<number> {
        const record = await this.getMember(guildId, userId)
        if (!record) return -1
        const above = await this.db
            .getRepository(this.RecordEntity)
            .createQueryBuilder("r")
            .where("r.guildId = :guildId AND r.xp > :xp", { guildId, xp: record.xp })
            .getCount()
        return above + 1
    }

    public static async resetGuild(guildId: Snowflake) {
        await this.db.getRepository(this.RecordEntity).delete({ guildId })
    }

    public static async resetMember(guildId: Snowflake, userId: Snowflake) {
        await this.deleteMember(guildId, userId)
    }

    // ── Guild Config ──────────────────────────────────────────────────────────

    public static async getConfig(guildId: Snowflake): Promise<ILevelConfig> {
        if (this.configCache.has(guildId)) return this.configCache.get(guildId)!

        const row = await this.db
            .getRepository(this.ConfigEntity)
            .findOneBy({ guildId })

        const cfg: ILevelConfig = row ? JSON.parse(row.config) : {}
        this.configCache.set(guildId, cfg)
        return cfg
    }

    public static async setConfig(guildId: Snowflake, config: ILevelConfig) {
        // Merge with existing
        const existing = await this.getConfig(guildId)
        const merged = { ...existing, ...config }
        this.configCache.set(guildId, merged)

        const row = new GuildConfig()
        row.guildId = guildId
        row.config = JSON.stringify(merged)

        if (this.type === "mongodb") {
            const old = await this.db.getRepository(this.ConfigEntity).findOneBy({ guildId })
            if (old) {
                await this.db.getRepository(this.ConfigEntity).update(guildId, row)
                return
            }
        }
        await this.db.getRepository(this.ConfigEntity).save(row)
    }

    public static async patchConfig<K extends keyof ILevelConfig>(
        guildId: Snowflake,
        key: K,
        value: ILevelConfig[K]
    ) {
        const cfg = await this.getConfig(guildId)
        cfg[key] = value
        await this.setConfig(guildId, cfg)
    }

    public static async resetConfig(guildId: Snowflake) {
        this.configCache.delete(guildId)
        await this.db.getRepository(this.ConfigEntity).delete({ guildId })
    }

    /** Returns the resolved config with defaults applied */
    public static async resolvedConfig(guildId: Snowflake): Promise<Required<
        Pick<ILevelConfig,
            "enabled" | "xpMin" | "xpMax" | "xpCooldown" | "xpMultiplier" |
            "formula" | "xpBase" | "xpExponent" | "maxLevel" | "stackRoles"
        >
    > & ILevelConfig> {
        const cfg = await this.getConfig(guildId)
        return { ...DEFAULT_CONFIG, ...cfg }
    }
}
