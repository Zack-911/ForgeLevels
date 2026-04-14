import { ArgType, NativeFunction } from "@tryforge/forgescript"
import { ILevelEvents } from "../../structures/eventManager"

export default new NativeFunction({
    name: "$levelEventGuildID",
    version: "1.0.0",
    description: "Inside a level event command, returns the guild ID.",
    unwrap: true,
    output: ArgType.String,
    args: [],
    async execute(ctx) {
        // @ts-ignore
        return this.success((ctx.runtime.extras as ILevelEvents["levelUp"][0]).guildId)
    },
})