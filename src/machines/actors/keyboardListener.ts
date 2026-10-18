import { sounds } from "@assets/sfx/sounds";
import { fromCallback } from "xstate";

const env = import.meta.env;

export const keyboardListener = fromCallback(({ input, sendBack }) => {
    const handleKeyPress = (event: KeyboardEvent) => {
        const context = input as GameContext;
        if (!context) return;

        const isDemoPlaying = context.isDemoPlaying ?? false;
        const status = context.status ?? 'demo';
        const currentPath = context.currentPath ?? [];
        const currentIndex = context.currentIndex ?? 0;

        if (isDemoPlaying || status === "success" || context.status === "error")
            return;

        let direction: GridValue | null = null;
        let moveDirection: { x: number; y: number } | null = null;

        switch (event.key) {
            case "ArrowLeft":
            case "a":
            case "A":
            case "q":
            case "Q":
                direction = "left";
                moveDirection = { x: -1, y: 0 };
                break;
            case "ArrowRight":
            case "d":
            case "D":
                direction = "right";
                moveDirection = { x: 1, y: 0 };
                break;
            case "ArrowUp":
            case "w":
            case "W":
            case "z":
            case "Z":
                direction = "top";
                moveDirection = { x: 0, y: -1 };
                break;
            case "ArrowDown":
            case "s":
            case "S":
                direction = "bottom";
                moveDirection = { x: 0, y: 1 };
                break;
            default:
                return;
        }

        const gridSize = Number(env.VITE_GRID_SIZE);
        const lastConfirmedPosition = context.currentPath[currentIndex];
        if (!lastConfirmedPosition) return;

        const nextExpectedPosition = {
            x: lastConfirmedPosition.x + moveDirection.x,
            y: lastConfirmedPosition.y + moveDirection.y,
        };

        if (!currentPath[0]) return;
        if (
            (nextExpectedPosition.x === context.currentPath[0].x &&
            nextExpectedPosition.y === context.currentPath[0].y) ||
            nextExpectedPosition.x > gridSize - 1 ||
            nextExpectedPosition.x < 0 ||
            nextExpectedPosition.y > gridSize - 1 ||
            nextExpectedPosition.y < 0
        )
            return;

        sendBack({ type: "PLAY_SOUND", audioUrl: sounds.flip, rate: 1 + currentIndex * 0.06 });
        sendBack({ 
            type: "MOVE", 
            direction, 
            nextPosition: nextExpectedPosition 
        });
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
        window.removeEventListener("keydown", handleKeyPress);
    };
})