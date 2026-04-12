"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.xpForLevel = xpForLevel;
exports.totalXpForLevel = totalXpForLevel;
exports.levelFromXp = levelFromXp;
const types_1 = require("./types");
/**
 * Returns the XP required to reach `level` from `level - 1`.
 * i.e., the cost of a single level step.
 */
function xpForLevel(level, cfg) {
    const formula = cfg.formula ?? types_1.DEFAULT_CONFIG.formula;
    const base = cfg.xpBase ?? types_1.DEFAULT_CONFIG.xpBase;
    const exponent = cfg.xpExponent ?? types_1.DEFAULT_CONFIG.xpExponent;
    if (level <= 0)
        return 0;
    switch (formula) {
        case "linear":
            return base * level;
        case "quadratic":
            return base * level * level;
        case "exponential":
            return Math.floor(base * Math.pow(exponent, level));
        case "custom": {
            if (!cfg.customFormula)
                return base * level * level; // fallback
            try {
                // eslint-disable-next-line no-new-func
                const fn = new Function("level", "base", "exponent", `"use strict"; return (${cfg.customFormula});`);
                return Math.floor(fn(level, base, exponent));
            }
            catch {
                return base * level * level;
            }
        }
        default:
            return base * level * level;
    }
}
/**
 * Returns the total XP required to reach `level` (sum of all steps up to it).
 */
function totalXpForLevel(level, cfg) {
    let total = 0;
    for (let l = 1; l <= level; l++)
        total += xpForLevel(l, cfg);
    return total;
}
/**
 * Given a total XP amount, returns the current level and XP within that level.
 */
function levelFromXp(totalXp, cfg) {
    const maxLevel = cfg.maxLevel ?? types_1.DEFAULT_CONFIG.maxLevel;
    let level = 0;
    let consumed = 0;
    while (true) {
        const next = level + 1;
        if (maxLevel > 0 && next > maxLevel)
            break;
        const needed = xpForLevel(next, cfg);
        if (consumed + needed > totalXp)
            break;
        consumed += needed;
        level = next;
    }
    const nextLevelXp = (maxLevel > 0 && level >= maxLevel) ? 0 : xpForLevel(level + 1, cfg);
    const currentLevelXp = totalXp - consumed;
    const progress = nextLevelXp > 0 ? Math.min(currentLevelXp / nextLevelXp, 1) : 1;
    return { level, currentLevelXp, nextLevelXp, progress };
}
//# sourceMappingURL=XpFormula.js.map