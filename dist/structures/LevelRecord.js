"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoGuildConfig = exports.GuildConfig = exports.MongoLevelRecord = exports.LevelRecord = void 0;
const typeorm_1 = require("typeorm");
/**
 * SQLite / MySQL / PostgreSQL record for a member's leveling data.
 */
let LevelRecord = class LevelRecord {
    /** Composite key: guildId_userId */
    identifier;
    /** The guild this record belongs to */
    guildId;
    /** The user this record belongs to */
    userId;
    /** Total accumulated XP */
    xp;
    /** Current level (derived from xp but cached for fast leaderboard queries) */
    level;
    /** Total messages sent (used for stats) */
    totalMessages;
    /** Unix timestamp (ms) of the last XP gain — used for cooldown enforcement */
    lastXpAt;
};
exports.LevelRecord = LevelRecord;
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], LevelRecord.prototype, "identifier", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], LevelRecord.prototype, "guildId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], LevelRecord.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], LevelRecord.prototype, "xp", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], LevelRecord.prototype, "level", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], LevelRecord.prototype, "totalMessages", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], LevelRecord.prototype, "lastXpAt", void 0);
exports.LevelRecord = LevelRecord = __decorate([
    (0, typeorm_1.Entity)("forge_levels")
], LevelRecord);
/**
 * MongoDB variant of the LevelRecord.
 */
let MongoLevelRecord = class MongoLevelRecord extends LevelRecord {
    mongoId;
};
exports.MongoLevelRecord = MongoLevelRecord;
__decorate([
    (0, typeorm_1.ObjectIdColumn)(),
    __metadata("design:type", String)
], MongoLevelRecord.prototype, "mongoId", void 0);
exports.MongoLevelRecord = MongoLevelRecord = __decorate([
    (0, typeorm_1.Entity)("forge_levels")
], MongoLevelRecord);
/**
 * Per-guild configuration stored as a JSON blob.
 */
let GuildConfig = class GuildConfig {
    /** The guild ID — primary key */
    guildId;
    /**
     * Serialized JSON of ILevelConfig.
     * Stored as a string so it works across all DB adapters.
     */
    config;
};
exports.GuildConfig = GuildConfig;
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], GuildConfig.prototype, "guildId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", default: "{}" }),
    __metadata("design:type", String)
], GuildConfig.prototype, "config", void 0);
exports.GuildConfig = GuildConfig = __decorate([
    (0, typeorm_1.Entity)("forge_levels_config")
], GuildConfig);
/**
 * MongoDB variant of GuildConfig.
 */
let MongoGuildConfig = class MongoGuildConfig extends GuildConfig {
    mongoId;
};
exports.MongoGuildConfig = MongoGuildConfig;
__decorate([
    (0, typeorm_1.ObjectIdColumn)(),
    __metadata("design:type", String)
], MongoGuildConfig.prototype, "mongoId", void 0);
exports.MongoGuildConfig = MongoGuildConfig = __decorate([
    (0, typeorm_1.Entity)("forge_levels_config")
], MongoGuildConfig);
//# sourceMappingURL=LevelRecord.js.map