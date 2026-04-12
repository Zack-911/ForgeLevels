"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LevelsCommandManager = void 0;
const forgescript_1 = require("@tryforge/forgescript");
class LevelsCommandManager extends forgescript_1.BaseCommandManager {
    constructor() {
        super(...arguments);
        this.handlerName = "ForgeLevelsEvents";
    }
}
exports.LevelsCommandManager = LevelsCommandManager;
//# sourceMappingURL=commandManager.js.map