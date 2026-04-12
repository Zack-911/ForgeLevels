import { ArgType, NativeFunction } from "@tryforge/forgescript"
export default new NativeFunction({
    name: "$levelEventTotalXp",
    version: "1.0.0",
    description: "Inside a levelUp event, returns the member's total XP after levelling up.",
    unwrap: true,
    output: ArgType.Number,
    args: [],
    async execute(ctx) { return this.success((ctx as any).extras?.totalXp ?? 0) },
})
