import { ArgType, NativeFunction } from "@tryforge/forgescript"
export default new NativeFunction({
    name: "$levelEventRewardLabel",
    version: "1.0.0",
    description: "Inside a levelReward event command, returns the reward label.",
    unwrap: true,
    output: ArgType.String,
    args: [],
    async execute(ctx) { return this.success((ctx as any).extras?.label ?? "") },
})
