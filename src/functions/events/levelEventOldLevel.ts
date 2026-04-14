import { ArgType, NativeFunction } from "@tryforge/forgescript"
import { ILevelEvents } from "../../structures/eventManager"

export default new NativeFunction({
    name: "$levelEventNewLevel",
    version: "1.0.0",
    description: "Inside a levelUp event command, returns the new level.",
    unwrap: true,
    output: ArgType.Number,
    args: [],
    async execute(ctx) {
        // @ts-ignore
        return this.success((ctx.runtime.extras as ILevelEvents["levelUp"][0]).newLevel)
    },
})
