"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const eventManager_1 = require("../structures/eventManager");
const __1 = require("..");
exports.default = new eventManager_1.LevelsEventHandler({
    name: "databaseConnect",
    version: "1.0.0",
    description: "Fired when the ForgeLevels database has connected",
    listener: async function () {
        const commands = this.getExtension(__1.ForgeLevels, true).commands.get("databaseConnect");
        for (const command of commands) {
            forgescript_1.Interpreter.run({
                client: this,
                command,
                data: command.compiled.code,
                obj: {},
            });
        }
    },
});
//# sourceMappingURL=databaseConnect.js.map