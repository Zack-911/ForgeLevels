import { ILevelConfig } from "./types";
/**
 * Returns the XP required to reach `level` from `level - 1`.
 * i.e., the cost of a single level step.
 */
export declare function xpForLevel(level: number, cfg: ILevelConfig): number;
/**
 * Returns the total XP required to reach `level` (sum of all steps up to it).
 */
export declare function totalXpForLevel(level: number, cfg: ILevelConfig): number;
/**
 * Given a total XP amount, returns the current level and XP within that level.
 */
export declare function levelFromXp(totalXp: number, cfg: ILevelConfig): {
    level: number;
    currentLevelXp: number;
    nextLevelXp: number;
    progress: number;
};
//# sourceMappingURL=XpFormula.d.ts.map