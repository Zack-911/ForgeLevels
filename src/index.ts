import { EventManager, ForgeClient, ForgeExtension, Logger } from "@tryforge/forgescript"
import { TypedEmitter } from "tiny-typed-emitter"
import path from "path"
import { LevelsCommandManager, ILevelEvents } from "./structures"
import { LevelsDatabase } from "./structures/LevelsDatabase"
import { handleMessage } from "./handlers/messageHandler"
import { description, version } from "../package.json"

export type TransformEvents<T> = {
    [P in keyof T]: T[P] extends unknown[] ? (...args: T[P]) => void : never
}

export interface IForgeLevelsOptions {
    events?: Array<keyof ILevelEvents>
}

export class ForgeLevels extends ForgeExtension {
    name = "forge.levels"
    description = description
    version = version
    requireExtensions = ["forge.db"]

    public emitter = new TypedEmitter<TransformEvents<ILevelEvents>>()
    public commands!: LevelsCommandManager
    public db!: typeof LevelsDatabase
    public client!: ForgeClient

    public constructor(public readonly options: IForgeLevelsOptions = {}) {
        super()
    }

    public async init(client: ForgeClient) {
        this.client = client
        this.commands = new LevelsCommandManager(client)
        this.db = LevelsDatabase

        EventManager.load("ForgeLevelsEvents", path.join(__dirname, "./events"))
        this.load(path.join(__dirname, "./functions"))

        if (this.options.events?.length) {
            this.client.events.load("ForgeLevelsEvents", this.options.events)
        }

        // Initialise the TypeORM database
        const levelsDb = new LevelsDatabase()
        await levelsDb.init()
        this.emitter.emit("databaseConnect")

        // Hook into messageCreate for XP processing
        const ext = this
        client.on("messageCreate", (msg) => handleMessage(msg, ext))

        Logger.info(`[ForgeLevels] v${this.version} ready.`)
    }
}

export * from "./structures"
