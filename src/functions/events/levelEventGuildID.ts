import { ArgType, NativeFunction } from "@tryforge/forgescript"
import { ILevelEvents } from "../../structures/eventManager"

export default new NativeFunction({
    name: "$levelEventUserID",
    version: "1.0.0",
    description: "Inside a levelUp/xpGain/levelReward event, returns the user ID.",
    unwrap: true,
    output: ArgType.String,
    args: [],
    async execute(ctx) {
        // @ts-ignore
        return this.success((ctx.runtime.extras as ILevelEvents["levelUp"][0]).userId)
    },
})