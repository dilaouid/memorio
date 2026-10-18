import React from "react";

import demoLamp from "@assets/lamp/demo.svg";
import errorLamp from "@assets/lamp/error.svg";
import successLamp from "@assets/lamp/success.svg";
import yourTurnLamp from "@assets/lamp/your_turn.svg";

type StatusLampProps = {
  status: "demo" | "error" | "success" | "yourTurn";
};

const lamps: Record<StatusLampProps["status"], string> = {
  demo: demoLamp,
  error: errorLamp,
  success: successLamp,
  yourTurn: yourTurnLamp,
};

const StatusLamp: React.FC<StatusLampProps> = ({ status }) => {
  return (
    <img
      src={lamps[status] ?? yourTurnLamp}
      alt="Status Lamp"
      className="status-lamp"
    />
  );
};

export default StatusLamp;
