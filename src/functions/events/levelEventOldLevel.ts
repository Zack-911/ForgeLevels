import { ArgType, NativeFunction } from "@tryforge/forgescript"
export default new NativeFunction({
    name: "$levelEventOldLevel",
    version: "1.0.0",
    description: "Inside a levelUp event command, returns the old level.",
    unwrap: true,
    output: ArgType.Number,
    args: [],
    async execute(ctx) { return this.success((ctx as any).extras?.oldLevel ?? 0) },
})
