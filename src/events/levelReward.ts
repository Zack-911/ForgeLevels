import { Interpreter } from "@tryforge/forgescript"
import { LevelsEventHandler } from "../structures/eventManager"
import { ForgeLevels } from ".."

export default new LevelsEventHandler({
    name: "levelReward",
    version: "1.0.0",
    description: "Fired when a member earns a message/custom reward",
    listener: async function ({ userId, guildId, level, label, obj }) {
        const ext = this.getExtension(ForgeLevels, true)
        const commands = ext.commands.get("levelReward")
        for (const command of commands) {
            Interpreter.run({
                client: this,
                command,
                data: command.compiled.code,
                obj: obj || {},
                extras: { userId, guildId, level, label },
            })
        }
    },
})
