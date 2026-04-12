import { ArgType, NativeFunction } from "@tryforge/forgescript";
export declare enum LevelConfigKey {
    enabled = 0,
    xpMin = 1,
    xpMax = 2,
    xpCooldown = 3,
    xpMultiplier = 4,
    formula = 5,
    xpBase = 6,
    xpExponent = 7,
    customFormula = 8,
    maxLevel = 9,
    stackRoles = 10
}
export declare enum XPFormula {
    linear = 0,
    quadratic = 1,
    exponential = 2,
    custom = 3
}
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
    type: ArgType.String;
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
//# sourceMappingURL=setLevelConfig.d.ts.map