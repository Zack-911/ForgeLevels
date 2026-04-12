import "reflect-metadata";
import { MixedList, EntitySchema } from "typeorm";
import { DataBaseManager } from "@tryforge/forge.db";
import { Snowflake } from "discord.js";
import { LevelRecord } from "./LevelRecord";
import { ILevelConfig } from "./types";
export declare abstract class LevelsDatabaseManager extends DataBaseManager {
    constructor();
}
export declare class LevelsDatabase extends LevelsDatabaseManager {
    database: string;
    entityManager: {
        sqlite: MixedList<Function | string | EntitySchema>;
        mongodb: MixedList<Function | string | EntitySchema>;
        mysql: MixedList<Function | string | EntitySchema>;
        postgres: MixedList<Function | string | EntitySchema>;
    };
    private static db;
    private db;
    private static RecordEntity;
    private static ConfigEntity;
    private static configCache;
    constructor();
    init(): Promise<void>;
    private static makeId;
    static getMember(guildId: Snowflake, userId: Snowflake): Promise<LevelRecord | null>;
    static setMember(record: LevelRecord): Promise<void>;
    /** Atomically increments the message count for a member. */
    static addMessage(guildId: Snowflake, userId: Snowflake): Promise<void>;
    static deleteMember(guildId: Snowflake, userId: Snowflake): Promise<import("typeorm").DeleteResult>;
    /** Creates a fresh LevelRecord with the composite identifier set */
    static makeFreshRecord(guildId: Snowflake, userId: Snowflake): LevelRecord;
    /** Gets or creates a member record */
    static getOrCreate(guildId: Snowflake, userId: Snowflake): Promise<LevelRecord>;
    static getLeaderboard(guildId: Snowflake, page?: number, perPage?: number, sortBy?: 0 | 1 | 2): Promise<LevelRecord[]>;
    static getTotalMembers(guildId: Snowflake): Promise<number>;
    static getRank(guildId: Snowflake, userId: Snowflake): Promise<number>;
    static resetGuild(guildId: Snowflake): Promise<void>;
    static resetMember(guildId: Snowflake, userId: Snowflake): Promise<void>;
    static getConfig(guildId: Snowflake): Promise<ILevelConfig>;
    static setConfig(guildId: Snowflake, config: ILevelConfig): Promise<void>;
    static patchConfig<K extends keyof ILevelConfig>(guildId: Snowflake, key: K, value: ILevelConfig[K]): Promise<void>;
    static resetConfig(guildId: Snowflake): Promise<void>;
    /** Returns the resolved config with defaults applied */
    static resolvedConfig(guildId: Snowflake): Promise<Required<Pick<ILevelConfig, "enabled" | "xpMin" | "xpMax" | "xpCooldown" | "xpMultiplier" | "formula" | "xpBase" | "xpExponent" | "maxLevel" | "stackRoles">> & ILevelConfig>;
}
//# sourceMappingURL=LevelsDatabase.d.ts.map