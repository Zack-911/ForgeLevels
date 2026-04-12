import { ArgType, NativeFunction } from "@tryforge/forgescript"
export default new NativeFunction({
    name: "$levelEventUserID",
    version: "1.0.0",
    description: "Inside a levelUp/xpGain/levelReward event, returns the user ID.",
    unwrap: true,
    output: ArgType.String,
    args: [],
    async execute(ctx) { return this.success((ctx as any).extras?.userId ?? "") },
})
