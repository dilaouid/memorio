/* eslint-disable @typescript-eslint/no-explicit-any */
import { MdMusicNote, MdMusicOff } from "react-icons/md";

interface MuteMusicProps {
  muteMusic: boolean;
  send: (event: any) => void;
}

export const MuteMusic: React.FC<MuteMusicProps> = ({ muteMusic, send }) => {
  return (
    <div
      className="music-control-icon"
      onClick={() => send({ type: "MUTE" })}
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        fontSize: "44px",
        color: "white",
        opacity: "0.7",
        cursor: "pointer",
      }}
    >
      {muteMusic ? <MdMusicOff /> : <MdMusicNote />}
    </div>
  );
};
