import { ArgType, NativeFunction } from "@tryforge/forgescript"
import { ILevelEvents } from "../../structures/eventManager"

export default new NativeFunction({
    name: "$levelEventXp",
    version: "1.0.0",
    description: "Inside an xpGain event, returns the XP gained. Inside levelUp, returns total XP.",
    unwrap: true,
    output: ArgType.Number,
    args: [],
    async execute(ctx) {
        // @ts-ignore
        const extras = ctx.runtime.extras as ILevelEvents["xpGain"][0]
        return this.success(extras.xp ?? (extras as any).totalXp)
    },
})