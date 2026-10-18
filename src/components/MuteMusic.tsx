/* eslint-disable @typescript-eslint/no-explicit-any */
import { MdMusicNote, MdMusicOff } from "react-icons/md";

interface MuteMusicProps {
  muteMusic: boolean;
  send: (event: any) => void;
}

export const MuteMusic: React.FC<MuteMusicProps> = ({ muteMusic, send }) => {
  return (
    <div
      className="music-control-icon corner-icon"
      onClick={() => send({ type: "MUTE" })}
    >
      {muteMusic ? <MdMusicOff /> : <MdMusicNote />}
    </div>
  );
};
