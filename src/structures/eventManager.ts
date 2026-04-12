import { BaseEventHandler, ForgeClient } from "@tryforge/forgescript"
import { ForgeLevels } from ".."

export interface ILevelEvents {
    /** Fired when a member gains XP */
    xpGain: [{ userId: string; guildId: string; xp: number; totalXp: number }]
    /** Fired when a member levels up */
    levelUp: [{ userId: string; guildId: string; oldLevel: number; newLevel: number; totalXp: number }]
    /** Fired when a role reward is granted */
    levelReward: [{ userId: string; guildId: string; level: number; label: string }]
    /** Fired when the database has connected */
    databaseConnect: []
}

export class LevelsEventHandler<T extends keyof ILevelEvents>
    extends BaseEventHandler<ILevelEvents, T> {
    register(client: ForgeClient): void {
        client
            .getExtension(ForgeLevels, true)
            .emitter
            .on(this.name, this.listener.bind(client) as any)
    }
}
