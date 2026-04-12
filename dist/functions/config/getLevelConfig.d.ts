import { ArgType, NativeFunction } from "@tryforge/forgescript";
import { LevelConfigKey } from "./setLevelConfig";
declare const _default: NativeFunction<[{
    name: string;
    description: string;
    type: ArgType.Enum;
    enum: typeof LevelConfigKey;
    required: true;
    rest: false;
}, {
    name: string;
    description: string;
    type: ArgType.Guild;
    required: false;
    rest: false;
}], true>;
export default _default;
//# sourceMappingURL=getLevelConfig.d.ts.map