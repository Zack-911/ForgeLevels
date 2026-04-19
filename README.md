# ForgeLevels

A powerful, fully customizable **per-guild leveling system** for [ForgeScript](https://github.com/tryforge/ForgeScript) bots.

## Features

- ✅ XP awarded automatically on every message
- ✅ Per-guild configuration (XP range, cooldown, formula, max level, notifications)
- ✅ 4 XP formulas: `linear`, `quadratic`, `exponential`, `custom`
- ✅ Role & channel XP multipliers (stack)
- ✅ Role rewards at specific levels (stack or singular mode)
- ✅ Custom message rewards (`levelReward` event)
- ✅ Configurable level-up notifications: `channel` | `dm` | `custom` | `none`
- ✅ Ignore lists: channels, roles, users
- ✅ No-XP roles (appear on leaderboard but earn nothing)
- ✅ Paginated leaderboard with custom formatting
- ✅ Full TypeORM persistence via ForgeDB (SQLite / MySQL / PostgreSQL / MongoDB)
- ✅ Config cached in-memory to minimise DB reads per message

---

## Installation

```bash
npm install @tryforge/forge.levels
```

> **Requires:** `@tryforge/forgescript ^2.5.0` and `@tryforge/forge.db ^2.1.0`

---

## Quick Start

```ts
import { ForgeClient } from "@tryforge/forgescript"
import { ForgeDB } from "@tryforge/forge.db"
import { ForgeLevels } from "forgelevels"

const client = new ForgeClient({
    token: process.env.DISCORD_TOKEN,
    intents: ["Guilds", "GuildMessages", "MessageContent"],
    prefixes: ["!"],
    events: ["messageCreate"],
    extensions: [
        new ForgeDB({ type: "sqlite" }),
        new ForgeLevels({
            events: ["levelUp", "xpGain", "levelReward"],
            autoNotify: true,
            defaultNotification: "channel",
            defaultMessage: "🎉 {user} reached Level **{level}**!",
        }),
    ],
})

client.login()
```

---

## Extension Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `events` | `string[]` | `[]` | Events to register commands for |
| `autoNotify` | `boolean` | `true` | Auto-send level-up messages |
| `defaultNotification` | `"channel" \| "dm" \| "custom" \| "none"` | `"channel"` | Where to send level-up messages |
| `defaultMessage` | `string` | `"🎉 {user} just reached level **{level}**!"` | Default level-up message template |

Template variables: `{user}` `{level}` `{oldLevel}` `{xp}` `{guild}`

---

## Per-Guild Config (`$setLevelConfig`)

All settings are per-guild and persist in the database.

```
$setLevelConfig[key;value;guildID?]
$getLevelConfig[key;guildID?]
$resetLevelConfig[guildID?]
```

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `enabled` | boolean | `true` | Enable/disable leveling |
| `xpMin` | number | `15` | Min XP per message |
| `xpMax` | number | `25` | Max XP per message |
| `xpCooldown` | number | `60000` | Cooldown between XP gains (ms) |
| `xpMultiplier` | number | `1` | Global XP multiplier |
| `formula` | string | `"quadratic"` | XP formula: `linear`, `quadratic`, `exponential`, `custom` |
| `xpBase` | number | `100` | Base value for XP formula |
| `xpExponent` | number | `1.5` | Exponent for exponential formula |
| `customFormula` | string | — | JS expression: `base * level * (level + 1) / 2` |
| `maxLevel` | number | `0` | Level cap (0 = unlimited) |
| `stackRoles` | boolean | `true` | Keep all role rewards vs. only highest |

### XP Formulas

| Formula | Calculation | Level 10 XP step |
|---------|-------------|-----------------|
| `linear` | `base * level` | 1,000 |
| `quadratic` | `base * level²` | 10,000 |
| `exponential` | `base * exponent^level` | ~5,766 |
| `custom` | Your JS expression | — |

---

## Functions Reference

### XP Functions

| Function | Description |
|----------|-------------|
| `$getXp[userID?;guildID?]` | Get total XP |
| `$setXp[xp;userID?;guildID?]` | Set XP directly |
| `$addXp[xp;userID?;guildID?]` | Add XP (fires events) |
| `$removeXp[xp;userID?;guildID?]` | Remove XP (floor: 0) |
| `$xpRequired[level;cumulative?;guildID?]` | XP for a level step or total |
| `$xpForNextLevel[userID?;guildID?]` | XP needed for next level |
| `$xpProgress[userID?;guildID?]` | XP within current level |
| `$levelProgress[userID?;guildID?]` | Progress % (0-100) |

### Level Functions

| Function | Description |
|----------|-------------|
| `$getLevel[userID?;guildID?]` | Get current level |
| `$setLevel[level;userID?;guildID?]` | Set level (adjusts XP) |
| `$resetLevel[userID?;guildID?]` | Reset member to 0 |
| `$resetGuildLevels[guildID?]` | Wipe all guild data |

### Rank & Leaderboard

| Function | Description |
|----------|-------------|
| `$getRank[userID?;guildID?]` | Leaderboard rank (1 = top) |
| `$getTotalMessages[userID?;guildID?]` | Total messages tracked |
| `$leaderboard[page?;perPage?;format?;separator?;guildID?]` | Formatted leaderboard |
| `$leaderboardSize[guildID?]` | Total ranked members |

**Leaderboard format tokens:** `{position}` `{userID}` `{user}` `{level}` `{xp}` `{messages}`

### Config Functions

| Function | Description |
|----------|-------------|
| `$setLevelConfig[key;value;guildID?]` | Set a config value |
| `$getLevelConfig[key;guildID?]` | Get a config value |
| `$resetLevelConfig[guildID?]` | Reset config to defaults |
| `$levelEnabled[guildID?]` | Returns true/false |
| `$toggleLevels[guildID?]` | Toggle on/off, returns new state |
| `$setLevelNotification[type;message?;channelID?;guildID?]` | Configure notifications |
| `$addXpMultiplier[multiplier;roleID?;channelID?;guildID?]` | Add XP multiplier |
| `$clearXpMultipliers[guildID?]` | Remove all multipliers |
| `$setIgnoredChannels[ids;guildID?]` | Set ignored channels (comma-separated) |
| `$setIgnoredRoles[ids;guildID?]` | Set ignored roles |
| `$setIgnoredUsers[ids;guildID?]` | Set ignored users |

### Reward Functions

| Function | Description |
|----------|-------------|
| `$addRoleReward[level;roleID;persistent?;guildID?]` | Add role reward at level |
| `$removeRoleReward[level;guildID?]` | Remove role reward |
| `$getRoleRewards[format?;separator?;guildID?]` | List all role rewards |
| `$addMessageReward[level;label;guildID?]` | Add custom reward (fires `levelReward`) |
| `$removeMessageReward[level;label?;guildID?]` | Remove custom reward |

### Event Data Functions (inside event commands)

| Function | Description |
|----------|-------------|
| `$levelEventUserID` | User ID from event |
| `$levelEventGuildID` | Guild ID from event |
| `$levelEventNewLevel` | New level (levelUp) |
| `$levelEventOldLevel` | Old level (levelUp) |
| `$levelEventXp` | XP gained (xpGain) or total (levelUp) |
| `$levelEventTotalXp` | Total XP after level-up |
| `$levelEventRewardLabel` | Reward label (levelReward) |
| `$levelEventLevel` | Level that triggered reward |

---

## Events

Register event commands using the event name as the command `type`:

```ts
client.commands.add({
    type: "levelUp",
    code: `🎉 <@$levelEventUserID> hit Level $levelEventNewLevel!`,
})

client.commands.add({
    type: "xpGain",
    code: `$log[$levelEventUserID gained $levelEventXp XP]`,
})

client.commands.add({
    type: "levelReward",
    code: `$sendDM[$levelEventUserID;You earned: $levelEventRewardLabel at Level $levelEventLevel!]`,
})
```

---

## Example Setup

```ts
// Double XP in #xp-boost channel
$addXpMultiplier[2;;$channelID]

// Triple XP for Booster role
$addXpMultiplier[3;$roleID]

// Role rewards
$addRoleReward[5;ROLE_ID_LVL5]
$addRoleReward[10;ROLE_ID_LVL10]
$addRoleReward[25;ROLE_ID_LVL25]

// Exponential formula, cap at level 50
$setLevelConfig[formula;exponential]
$setLevelConfig[xpBase;80]
$setLevelConfig[xpExponent;1.4]
$setLevelConfig[maxLevel;50]
```

---

## License

GPL-3.0
