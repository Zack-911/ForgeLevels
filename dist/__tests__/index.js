"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const forge_db_1 = require("@tryforge/forge.db");
const __1 = require("..");
// ─── Setup ────────────────────────────────────────────────────────────────────
const db = new forge_db_1.ForgeDB({
    type: "sqlite",
    folder: "database",
});
const levels = new __1.ForgeLevels({
    events: ["levelUp", "xpGain", "levelReward", "databaseConnect"],
    autoNotify: true,
    defaultNotification: "channel",
    defaultMessage: "🎉 {user} just leveled up to **Level {level}**! Keep it up!",
});
const client = new forgescript_1.ForgeClient({
    token: process.env.BOT_TOKEN,
    intents: ["Guilds", "GuildMessages", "MessageContent"],
    prefixes: ["!"],
    events: ["messageCreate"],
    extensions: [db, levels],
});
// ─── !rank [user?] ────────────────────────────────────────────────────────────
// Uses $mentioned[0;true] to get the mentioned user, or fall back to author.
// $message[0] = first word after prefix+command (0-indexed)
client.commands.add({
    name: "rank",
    type: "messageCreate",
    code: `
📊 **Rank Card** for <@$default[$mentioned[0];$authorID]>
▸ Level: **$getLevel[$default[$mentioned[0];$authorID]]**
▸ XP: **$xpProgress[$default[$mentioned[0];$authorID]]** / $xpForNextLevel[$default[$mentioned[0];$authorID]] XP
▸ Progress: **$levelProgress[$default[$mentioned[0];$authorID]]%**
`,
});
// ─── !leaderboard [page?] ─────────────────────────────────────────────────────
client.commands.add({
    name: "leaderboard",
    aliases: ["lb", "top"],
    type: "messageCreate",
    code: `
🏆 **Server Leaderboard** (Page $default[$message[0];1])
$leaderboard[$default[$message[0];1];10;{position}. <@{userID}> — Lvl {level} ({xp} XP)]
  `,
});
// ─── !setxprange <min> <max> ─────────────────────────────────────────────────
// $message[0] = min, $message[1] = max (0-indexed)
client.commands.add({
    name: "setxprange",
    type: "messageCreate",
    code: `
$onlyIf[$hasPerms[$guildID;$authorID;ManageGuild];You need Manage Server!]
$setLevelConfig[xpMin;$message[0]]
$setLevelConfig[xpMax;$message[1]]
✅ XP range set to **$message[0]** – **$message[1]** per message.
  `,
});
// ─── !setlevelchannel #channel ───────────────────────────────────────────────
// $mentionedChannels[0] = first mentioned channel (0-indexed)
client.commands.add({
    name: "setlevelchannel",
    type: "messageCreate",
    code: `
$onlyIf[$hasPerms[$guildID;$authorID;ManageGuild];You need Manage Server!]
$setLevelNotification[channel;🎉 {user} reached **Level {level}**!;$mentionedChannels[0]]
✅ Level-up notifications will now go to <#$mentionedChannels[0]>.
  `,
});
// ─── !addrolereward <level> @role ────────────────────────────────────────────
// $message[0] = level number, $mentionedRoles[0] = first mentioned role
client.commands.add({
    name: "addrolereward",
    type: "messageCreate",
    code: `
$onlyIf[$hasPerms[$guildID;$authorID;ManageGuild];You need Manage Server!]
$addRoleReward[$message[0];$mentionedRoles[0]]
✅ Role <@&$mentionedRoles[0]> will be awarded at Level **$message[0]**.
  `,
});
// ─── !rolerewards ─────────────────────────────────────────────────────────────
client.commands.add({
    name: "rolerewards",
    type: "messageCreate",
    code: `
🎁 **Role Rewards:**
$getRoleRewards[Level {level} → <@&{roleID}>]
  `,
});
// ─── !togglelevels ────────────────────────────────────────────────────────────
client.commands.add({
    name: "togglelevels",
    type: "messageCreate",
    code: `
$onlyIf[$hasPerms[$guildID;$authorID;ManageGuild];You need Manage Server!]
$if[$toggleLevels==true;
✅ Leveling system **enabled**.
;
🚫 Leveling system **disabled**.
]
  `,
});
// ─── !setformula <formula> [base?] ───────────────────────────────────────────
// formula options: linear, quadratic, exponential, custom
// $message[0] = formula name, $message[1] = base (optional)
client.commands.add({
    name: "setformula",
    type: "messageCreate",
    code: `
$onlyIf[$hasPerms[$guildID;$authorID;ManageGuild];You need Manage Server!]
$setLevelConfig[formula;$message[0]]
$setLevelConfig[xpBase;$default[$message[1];100]]
✅ Formula set to **$message[0]** with base **$default[$message[1];100]**.

XP needed to reach next levels:
Level 5: $xpRequired[5] XP (step) / $xpRequired[5;cumulative] XP (total)
Level 10: $xpRequired[10] XP (step) / $xpRequired[10;cumulative] XP (total)
Level 20: $xpRequired[20] XP (step) / $xpRequired[20;cumulative] XP (total)
  `,
});
// ─── !addxp <amount> [@user?] ────────────────────────────────────────────────
client.commands.add({
    name: "addxp",
    type: "messageCreate",
    code: `
$onlyIf[$hasPerms[$guildID;$authorID;ManageGuild];You need Manage Server!]
$addXp[$message[0];$default[$mentioned[0];$authorID]]
✅ Added **$message[0]** XP to <@$default[$mentioned[0];$authorID]>.
  `,
});
// ─── !setlevel <level> [@user?] ──────────────────────────────────────────────
client.commands.add({
    name: "setlevel",
    type: "messageCreate",
    code: `
$onlyIf[$hasPerms[$guildID;$authorID;ManageGuild];You need Manage Server!]
$setLevel[$message[0];$default[$mentioned[0];$authorID]]
✅ Set <@$default[$mentioned[0];$authorID]>'s level to **$message[0]**.
  `,
});
// ─── !resetuser [@user?] ─────────────────────────────────────────────────────
client.commands.add({
    name: "resetuser",
    type: "messageCreate",
    code: `
$onlyIf[$hasPerms[$guildID;$authorID;ManageGuild];You need Manage Server!]
$resetLevel[$default[$mentioned[0];$authorID]]
✅ Reset <@$default[$mentioned[0];$authorID]>'s XP and level.
  `,
});
// ─── levelUp event handler ───────────────────────────────────────────────────
levels.commands.add({
    name: "levelUp",
    type: "levelUp",
    code: `
🎉 <@$levelEventUserID> just reached Level **$levelEventNewLevel**!
They now have **$levelEventTotalXp** total XP.
  `,
});
// ─── levelReward event handler ───────────────────────────────────────────────
levels.commands.add({
    name: "levelReward",
    type: "levelReward",
    code: `
$sendDM[$levelEventUserID;🎁 You earned a reward at Level $levelEventLevel: **$levelEventRewardLabel**!]
  `,
});
// ─── Eval / owner commands ────────────────────────────────────────────────────
client.commands.add({
    name: "eval",
    aliases: ["e", "ev"],
    type: "messageCreate",
    code: `
$onlyForUsers[;$botOwnerID]
$deleteCommand
$eval[$message;false]
  `,
});
client.login();
//# sourceMappingURL=index.js.map