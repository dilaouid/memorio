import { saveBestScore } from "@utils/gameUtils";

export const saveBestScoreAssign = (context: GameContext) => {
    if (context.score <= context.bestScore) return {};
    saveBestScore(context.score);
    return { bestScore: context.score };
};
