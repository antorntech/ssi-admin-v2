import { Pause, Play } from "iconsax-react";
import cn from "../utils/cn";

/* eslint-disable react/prop-types */
const PlayPause = ({
  play = true,
  onPlay = async () => {},
  onPause = async () => {},
  className = "",
}) => {
  if (!play) {
    return (
      <button onClick={onPlay} className={cn("", className)} type="button">
        <Play size="22" className="text-green-600" variant="Bold" />
      </button>
    );
  } else {
    return (
      <button onClick={onPause} className={cn("", className)} type="button">
        <Pause size="22" className="text-red-600" variant="Bold" />
      </button>
    );
  }
};

export default PlayPause;
