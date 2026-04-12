import { BaseCommandManager } from "@tryforge/forgescript"
import { ILevelEvents } from "./eventManager"

export class LevelsCommandManager extends BaseCommandManager<keyof ILevelEvents> {
    public handlerName = "ForgeLevelsEvents"
}