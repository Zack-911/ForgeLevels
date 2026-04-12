import { ForgeClient, ForgeExtension } from "@tryforge/forgescript";
import { TypedEmitter } from "tiny-typed-emitter";
import { LevelsCommandManager, ILevelEvents } from "./structures";
import { LevelsDatabase } from "./structures/LevelsDatabase";
export type TransformEvents<T> = {
    [P in keyof T]: T[P] extends unknown[] ? (...args: T[P]) => void : never;
};
export interface IForgeLevelsOptions {
    events?: Array<keyof ILevelEvents>;
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