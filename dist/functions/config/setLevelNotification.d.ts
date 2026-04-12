import { ArgType, NativeFunction } from "@tryforge/forgescript";
export declare enum NotificationType {
    channel = 0,
    dm = 1,
    custom = 2,
    none = 3
}
declare const _default: NativeFunction<[{
    name: string;
    description: string;
    type: ArgType.Enum;
    enum: typeof NotificationType;
    required: true;
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
    type: ArgType.Channel;
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
//# sourceMappingURL=setLevelNotification.d.ts.map