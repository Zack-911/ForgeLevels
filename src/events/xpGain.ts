import { Interpreter } from "@tryforge/forgescript"
import { LevelsEventHandler } from "../structures/eventManager"
import { ForgeLevels } from ".."

export default new LevelsEventHandler({
    name: "xpGain",
    version: "1.0.0",
    description: "Fired when a member earns XP from a message",
    listener: async function ({ userId, guildId, xp, totalXp }) {
        const ext = this.getExtension(ForgeLevels, true)
        const commands = ext.commands.get("xpGain")
        for (const command of commands) {
            Interpreter.run({
                client: this,
                command,
                data: command.compiled.code,
                obj: {},
                extras: { userId, guildId, xp, totalXp },
            })
        }
    },
})
