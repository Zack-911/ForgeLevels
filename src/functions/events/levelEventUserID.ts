import { ArgType, NativeFunction } from "@tryforge/forgescript"
import { ILevelEvents } from "../../structures/eventManager"

export default new NativeFunction({
    name: "$levelEventRewardLabel",
    version: "1.0.0",
    description: "Inside a levelReward event command, returns the reward label.",
    unwrap: true,
    output: ArgType.String,
    args: [],
    async execute(ctx) {
        // @ts-ignore
        return this.success((ctx.runtime.extras as ILevelEvents["levelReward"][0]).label)
    },
})