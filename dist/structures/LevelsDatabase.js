"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LevelsDatabase = exports.LevelsDatabaseManager = void 0;
require("reflect-metadata");
const forge_db_1 = require("@tryforge/forge.db");
const LevelRecord_1 = require("./LevelRecord");
const types_1 = require("./types");
// ─── Abstract base (mirrors GiveawaysDatabaseManager) ────────────────────────
class LevelsDatabaseManager extends forge_db_1.DataBaseManager {
    constructor() { super(); }
}
exports.LevelsDatabaseManager = LevelsDatabaseManager;
// ─── Concrete DB class ────────────────────────────────────────────────────────
class LevelsDatabase extends LevelsDatabaseManager {
    database = "forge.levels.db";
    entityManager = {
        sqlite: [LevelRecord_1.LevelRecord, LevelRecord_1.GuildConfig],
        mongodb: [LevelRecord_1.MongoLevelRecord, LevelRecord_1.MongoGuildConfig],
        mysql: [LevelRecord_1.LevelRecord, LevelRecord_1.GuildConfig],
        postgres: [LevelRecord_1.LevelRecord, LevelRecord_1.GuildConfig],
    };
    static db;
    db;
    static RecordEntity;
    static ConfigEntity;
    // Config cache — reduces DB hits for every message
    static configCache = new Map();
    constructor() {
        super();
        this.type ??= "sqlite";
        this.db = this.getDB();
    }
    async init() {
        LevelsDatabase.db = await this.db;
        // Correctly set entities after DB type is resolved from getDB()
        const isMongo = this.type === "mongodb";
        LevelsDatabase.RecordEntity = isMongo ? LevelRecord_1.MongoLevelRecord : LevelRecord_1.LevelRecord;
        LevelsDatabase.ConfigEntity = isMongo ? LevelRecord_1.MongoGuildConfig : LevelRecord_1.GuildConfig;
    }
    // ── Helpers ──────────────────────────────────────────────────────────────
    static makeId(guildId, userId) {
        return `${guildId}_${userId}`;
    }
    // ── Member record CRUD ────────────────────────────────────────────────────
    static async getMember(guildId, userId) {
        return await this.db
            .getRepository(this.RecordEntity)
            .findOneBy({ identifier: this.makeId(guildId, userId) }) ?? null;
    }
    static async setMember(record) {
        if (this.type === "mongodb") {
            const old = await this.getMember(record.guildId, record.userId);
            if (old) {
                await this.db.getRepository(this.RecordEntity).update(old.identifier, record);
                return;
            }
        }
        await this.db.getRepository(this.RecordEntity).save(record);
    }
    /** Atomically increments the message count for a member. */
    static async addMessage(guildId, userId, recordExists = false) {
        const identifier = this.makeId(guildId, userId);
        // Ensure record exists first if not already guaranteed
        if (!recordExists) {
            await this.getOrCreate(guildId, userId);
        }
        await this.db.getRepository(this.RecordEntity).increment({ identifier }, "totalMessages", 1);
    }
    static async deleteMember(guildId, userId) {
        return await this.db
            .getRepository(this.RecordEntity)
            .delete({ identifier: this.makeId(guildId, userId) });
    }
    /** Creates a fresh LevelRecord with the composite identifier set */
    static makeFreshRecord(guildId, userId) {
        const rec = new LevelRecord_1.LevelRecord();
        rec.identifier = this.makeId(guildId, userId);
        rec.guildId = guildId;
        rec.userId = userId;
        rec.xp = 0;
        rec.level = 0;
        rec.totalMessages = 0;
        rec.lastXpAt = 0;
        return rec;
    }
    /** Gets or creates a member record */
    static async getOrCreate(guildId, userId) {
        return (await this.getMember(guildId, userId)) ?? this.makeFreshRecord(guildId, userId);
    }
    // ── Leaderboard ───────────────────────────────────────────────────────────
    static async getLeaderboard(guildId, page = 1, perPage = 10, sortBy = 0 // 0=xp, 1=level, 2=totalMessages
    ) {
        const orderField = sortBy === 1 ? "level" : sortBy === 2 ? "totalMessages" : "xp";
        return await this.db
            .getRepository(this.RecordEntity)
            .find({
            where: { guildId },
            order: { [orderField]: "DESC" },
            skip: (page - 1) * perPage,
            take: perPage,
        });
    }
    static async getTotalMembers(guildId) {
        return await this.db
            .getRepository(this.RecordEntity)
            .countBy({ guildId });
    }
    static async getRank(guildId, userId) {
        const record = await this.getMember(guildId, userId);
        if (!record)
            return -1;
        const above = await this.db
            .getRepository(this.RecordEntity)
            .createQueryBuilder("r")
            .where("r.guildId = :guildId AND r.xp > :xp", { guildId, xp: record.xp })
            .getCount();
        return above + 1;
    }
    static async resetGuild(guildId) {
        await this.db.getRepository(this.RecordEntity).delete({ guildId });
    }
    static async resetMember(guildId, userId) {
        await this.deleteMember(guildId, userId);
    }
    // ── Guild Config ──────────────────────────────────────────────────────────
    static async getConfig(guildId) {
        if (this.configCache.has(guildId))
            return this.configCache.get(guildId);
        const row = await this.db
            .getRepository(this.ConfigEntity)
            .findOneBy({ guildId });
        const cfg = row ? JSON.parse(row.config) : {};
        this.configCache.set(guildId, cfg);
        return cfg;
    }
    static async setConfig(guildId, config) {
        // Merge with existing
        const existing = await this.getConfig(guildId);
        const merged = { ...existing, ...config };
        this.configCache.set(guildId, merged);
        const row = new LevelRecord_1.GuildConfig();
        row.guildId = guildId;
        row.config = JSON.stringify(merged);
        if (this.type === "mongodb") {
            const old = await this.db.getRepository(this.ConfigEntity).findOneBy({ guildId });
            if (old) {
                await this.db.getRepository(this.ConfigEntity).update(guildId, row);
                return;
            }
        }
        await this.db.getRepository(this.ConfigEntity).save(row);
    }
    static async patchConfig(guildId, key, value) {
        const cfg = await this.getConfig(guildId);
        cfg[key] = value;
        await this.setConfig(guildId, cfg);
    }
    static async resetConfig(guildId) {
        this.configCache.delete(guildId);
        await this.db.getRepository(this.ConfigEntity).delete({ guildId });
    }
    /** Returns the resolved config with defaults applied */
    static async resolvedConfig(guildId) {
        const cfg = await this.getConfig(guildId);
        return { ...types_1.DEFAULT_CONFIG, ...cfg };
    }
}
exports.LevelsDatabase = LevelsDatabase;
//# sourceMappingURL=LevelsDatabase.js.map