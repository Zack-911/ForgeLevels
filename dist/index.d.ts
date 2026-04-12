import { ForgeClient, ForgeExtension } from "@tryforge/forgescript";
import { TypedEmitter } from "tiny-typed-emitter";
import { LevelsCommandManager, ILevelEvents } from "./structures";
import { LevelsDatabase } from "./structures/LevelsDatabase";
export type TransformEvents<T> = {
    [P in keyof T]: T[P] extends unknown[] ? (...args: T[P]) => void : never;
};
export interface IForgeLevelsOptions {
    /** Events to load: "levelUp" | "xpGain" | "levelReward" | "databaseConnect" */
    events?: Array<keyof ILevelEvents>;
    /** Whether to automatically send level-up messages. Default: true */
    autoNotify?: boolean;
    /** Default notification channel/dm/custom/none. Default: "channel" */
    defaultNotification?: "channel" | "dm" | "custom" | "none";
    /** Default level-up message template. Supports {user} {level} {oldLevel} {xp} {guild} */
    defaultMessage?: string;
}
export declare class ForgeLevels extends ForgeExtension {
    readonly options: IForgeLevelsOptions;
    name: string;
    description: string;
    version: string;
    requireExtensions: string[];
    emitter: TypedEmitter<TransformEvents<ILevelEvents>>;
    commands: LevelsCommandManager;
    db: typeof LevelsDatabase;
    client: ForgeClient;
    constructor(options?: IForgeLevelsOptions);
    init(client: ForgeClient): Promise<void>;
}
export * from "./structures";
//# sourceMappingURL=index.d.ts.map