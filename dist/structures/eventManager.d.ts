import { BaseEventHandler, ForgeClient } from "@tryforge/forgescript";
export interface ILevelEvents {
    /** Fired when a member gains XP */
    xpGain: [{
        userId: string;
        guildId: string;
        xp: number;
        totalXp: number;
    }];
    /** Fired when a member levels up */
    levelUp: [{
        userId: string;
        guildId: string;
        oldLevel: number;
        newLevel: number;
        totalXp: number;
    }];
    /** Fired when a role reward is granted */
    levelReward: [{
        userId: string;
        guildId: string;
        level: number;
        label: string;
    }];
    /** Fired when the database has connected */
    databaseConnect: [];
}
export declare class LevelsEventHandler<T extends keyof ILevelEvents> extends BaseEventHandler<ILevelEvents, T> {
    register(client: ForgeClient): void;
}
//# sourceMappingURL=eventManager.d.ts.map