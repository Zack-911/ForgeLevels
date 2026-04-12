"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const eventManager_1 = require("../structures/eventManager");
const __1 = require("..");
exports.default = new eventManager_1.LevelsEventHandler({
    name: "xpGain",
    version: "1.0.0",
    description: "Fired when a member earns XP from a message",
    listener: async function ({ userId, guildId, xp, totalXp }) {
        const ext = this.getExtension(__1.ForgeLevels, true);
        const commands = ext.commands.get("xpGain");
        for (const command of commands) {
            forgescript_1.Interpreter.run({
                client: this,
                command,
                data: command.compiled.code,
                obj: {},
                extras: { userId, guildId, xp, totalXp },
            });
        }
    },
});
//# sourceMappingURL=xpGain.js.map