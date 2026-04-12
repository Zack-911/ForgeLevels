import { Interpreter } from "@tryforge/forgescript"
import { LevelsEventHandler } from "../structures/eventManager"
import { ForgeLevels } from ".."

export default new LevelsEventHandler({
    name: "databaseConnect",
    version: "1.0.0",
    description: "Fired when the ForgeLevels database has connected",
    listener: async function () {
        const commands = this.getExtension(ForgeLevels, true).commands.get("databaseConnect")
        for (const command of commands) {
            Interpreter.run({
                client: this,
                command,
                data: command.compiled.code,
                obj: {},
            })
        }
    },
})
