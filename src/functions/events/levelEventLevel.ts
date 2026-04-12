import { ArgType, NativeFunction } from "@tryforge/forgescript"
export default new NativeFunction({
    name: "$levelEventLevel",
    version: "1.0.0",
    description: "Inside a levelReward event command, returns the level that triggered the reward.",
    unwrap: true,
    output: ArgType.Number,
    args: [],
    async execute(ctx) { return this.success((ctx as any).extras?.level ?? 0) },
})
