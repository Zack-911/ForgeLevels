"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LevelsEventHandler = void 0;
const forgescript_1 = require("@tryforge/forgescript");
const __1 = require("..");
class LevelsEventHandler extends forgescript_1.BaseEventHandler {
    register(client) {
        client
            .getExtension(__1.ForgeLevels, true)
            .emitter
            .on(this.name, this.listener.bind(client));
    }
}
exports.LevelsEventHandler = LevelsEventHandler;
//# sourceMappingURL=eventManager.js.map