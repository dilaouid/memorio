import React from "react";

import { ROUND_TIME_LIMIT } from "@utils/gameUtils";

type PressureGaugeProps = {
    active: boolean;
    startRoundTime: Date | null;
};

// Shows the speed bonus draining while the player is tracing the path.
export const PressureGauge: React.FC<PressureGaugeProps> = ({ active, startRoundTime }) => {
    return (
        <div className="pressure-gauge" aria-hidden="true">
            <div
                key={startRoundTime?.getTime() ?? 0}
                className={`pressure-fill ${active ? "pressure-running" : ""}`}
                style={{ animationDuration: `${ROUND_TIME_LIMIT}s` }}
            />
        </div>
    );
};
