export type ScorePopupProps = {
    id: string;
    score: number;
    top: string;
    left: string;
    onFadeComplete: (id: string) => void;
};