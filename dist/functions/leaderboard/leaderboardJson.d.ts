import { ArgType, NativeFunction } from "@tryforge/forgescript";
import { LeaderboardSort } from "./leaderboard";
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
//# sourceMappingURL=leaderboardJson.d.ts.map