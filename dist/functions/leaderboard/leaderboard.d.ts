import { ArgType, NativeFunction } from "@tryforge/forgescript";
export declare enum LeaderboardSort {
    xp = 0,// Sort by total XP (default)
    level = 1,// Sort by level
    messages = 2
}
declare const _default: NativeFunction<[{
    name: string;
    description: string;
    type: ArgType.Number;
    required: false;
    rest: false;
}, {
    name: string;
    description: string;
    type: ArgType.Number;
    required: false;
    rest: false;
}, {
    name: string;
    description: string;
    type: ArgType.String;
    required: false;
    rest: false;
}, {
    name: string;
    description: string;
    type: ArgType.String;
    required: false;
    rest: false;
}, {
    name: string;
    description: string;
    type: ArgType.Enum;
    enum: typeof LeaderboardSort;
    required: false;
    rest: false;
}, {
    name: string;
    description: string;
    type: ArgType.Guild;
    required: false;
    rest: false;
}], true>;
export default _default;
//# sourceMappingURL=leaderboard.d.ts.map