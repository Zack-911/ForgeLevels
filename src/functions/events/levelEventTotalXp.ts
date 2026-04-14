import { ArgType, NativeFunction } from "@tryforge/forgescript"
import { ILevelEvents } from "../../structures/eventManager"

export default new NativeFunction({
    name: "$levelEventTotalXp",
    version: "1.0.0",
    description: "Inside a levelUp event, returns the member's total XP after levelling up.",
    unwrap: true,
    output: ArgType.Number,
    args: [],
    async execute(ctx) {
        // @ts-ignore
        return this.success((ctx.runtime.extras as ILevelEvents["levelUp"][0]).totalXp)
    },
})