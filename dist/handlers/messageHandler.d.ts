import { ForgeLevels } from "..";
import { Message } from "discord.js";
/**
 * This is the heart of ForgeLevels.
 * Listens to every messageCreate, counts all messages, enforces cooldown,
 * awards XP, detects level-ups, and fires the appropriate events.
 */
export declare function handleMessage(message: Message, ext: ForgeLevels): Promise<void>;
//# sourceMappingURL=messageHandler.d.ts.map