import { ArgType, NativeFunction } from "@tryforge/forgescript"
import { ILevelEvents } from "../../structures/eventManager"

export default new NativeFunction({
    name: "$levelEventLevel",
    version: "1.0.0",
    description: "Inside a levelReward event command, returns the level that triggered the reward.",
    unwrap: true,
    output: ArgType.Number,
    args: [],
    async execute(ctx) {
        // @ts-ignore
        return this.success((ctx.runtime.extras as ILevelEvents["levelReward"][0]).level)
    },
})