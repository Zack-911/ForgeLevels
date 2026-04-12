"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgeLevels = void 0;
const forgescript_1 = require("@tryforge/forgescript");
const tiny_typed_emitter_1 = require("tiny-typed-emitter");
const path_1 = __importDefault(require("path"));
const structures_1 = require("./structures");
const LevelsDatabase_1 = require("./structures/LevelsDatabase");
const messageHandler_1 = require("./handlers/messageHandler");
const package_json_1 = require("../package.json");
class ForgeLevels extends forgescript_1.ForgeExtension {
    constructor(options = {}) {
        super();
        this.options = options;
        this.name = "forge.levels";
        this.description = package_json_1.description;
        this.version = package_json_1.version;
        this.requireExtensions = ["forge.db"];
        this.emitter = new tiny_typed_emitter_1.TypedEmitter();
    }
    async init(client) {
        this.client = client;
        this.commands = new structures_1.LevelsCommandManager(client);
        this.db = LevelsDatabase_1.LevelsDatabase;
        forgescript_1.EventManager.load("ForgeLevelsEvents", path_1.default.join(__dirname, "./events"));
        this.load(path_1.default.join(__dirname, "./functions"));
        if (this.options.events?.length) {
            this.client.events.load("ForgeLevelsEvents", this.options.events);
        }
        // Initialise the TypeORM database
        const levelsDb = new LevelsDatabase_1.LevelsDatabase();
        await levelsDb.init();
        this.emitter.emit("databaseConnect");
        // Hook into messageCreate for XP processing
        const ext = this;
        client.on("messageCreate", (msg) => (0, messageHandler_1.handleMessage)(msg, ext));
        forgescript_1.Logger.info(`[ForgeLevels] v${this.version} ready.`);
    }
}
exports.ForgeLevels = ForgeLevels;
__exportStar(require("./structures"), exports);
//# sourceMappingURL=index.js.map