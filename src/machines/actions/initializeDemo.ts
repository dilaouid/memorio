export const initializeDemoAssign = (context: GameContext) => {
    return { ...context, currentIndex: 0, isDemoPlaying: true, status: 'demo' as LampStatus };
};