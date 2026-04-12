import { ArgType, NativeFunction } from "@tryforge/forgescript"
export default new NativeFunction({
    name: "$levelEventGuildID",
    version: "1.0.0",
    description: "Inside a level event command, returns the guild ID.",
    unwrap: true,
    output: ArgType.String,
    args: [],
    async execute(ctx) { return this.success((ctx as any).extras?.guildId ?? "") },
})
