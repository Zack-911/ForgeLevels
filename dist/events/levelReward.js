"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const eventManager_1 = require("../structures/eventManager");
const __1 = require("..");
exports.default = new eventManager_1.LevelsEventHandler({
    name: "levelReward",
    version: "1.0.0",
    description: "Fired when a member earns a message/custom reward",
    listener: async function ({ userId, guildId, level, label, obj }) {
        const ext = this.getExtension(__1.ForgeLevels, true);
        const commands = ext.commands.get("levelReward");
        for (const command of commands) {
            forgescript_1.Interpreter.run({
                client: this,
                command,
                data: command.compiled.code,
                obj: obj || {},
                extras: { userId, guildId, level, label },
            });
        }
    },
});
//# sourceMappingURL=levelReward.js.map