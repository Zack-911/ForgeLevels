import { ArgType, NativeFunction } from "@tryforge/forgescript"
export default new NativeFunction({
    name: "$levelEventXp",
    version: "1.0.0",
    description: "Inside levelUp/xpGain event: XP gained (xpGain) or total XP after level-up (levelUp).",
    unwrap: true,
    output: ArgType.Number,
    args: [],
    async execute(ctx) {
        const extras = (ctx as any).extras
        return this.success(extras?.xp ?? extras?.totalXp ?? 0)
    },
})
