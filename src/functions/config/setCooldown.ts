import { ArgType, NativeFunction } from "@tryforge/forgescript"
import { LevelsDatabase } from "../../structures/LevelsDatabase"

export default new NativeFunction({
  name: "$setCooldown",
  version: "1.0.0",
  description: "Set the time between each message for XP to be counted.",
  brackets: true,
  unwrap: true,
  args: [
    {
      name: "time",
      description: "The time to set it as.",
      type: ArgType.Time,
      required: true,
      rest: false,
    },
    {
      name: "guildID",
      description: "The guild ID. Defaults to current guild.",
      type: ArgType.Guild,
      required: false,
      rest: false,
    },
  ],
  async execute(ctx, [time, guild]) {
    const gid = guild?.id ?? ctx.guild?.id
    if (!gid) return this.customError("Missing guild.")
    await LevelsDatabase.patchConfig(gid, "xpCooldown", time)
    return this.success()
  },
})
