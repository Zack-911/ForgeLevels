import { ArgType, NativeFunction } from "@tryforge/forgescript";
export declare enum XpRequiredMode {
    step = 0,// XP for just this level step
    cumulative = 1
}
declare const _default: NativeFunction<[{
    name: string;
    description: string;
    type: ArgType.Number;
    required: true;
    rest: false;
}, {
    name: string;
    description: string;
    type: ArgType.Enum;
    enum: typeof XpRequiredMode;
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
//# sourceMappingURL=xpRequired.d.ts.map