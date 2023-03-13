import { Slider } from "@mui/material";
import React, { useState } from "react";
import * as MDIcons from "react-icons/md";

interface Props {
  volume: number;
  onChange: (volume: number) => void;
}

const Volume: React.FC<Props> = ({ volume, onChange }) => {
  const [oldVolume, setOldVolume] = useState(0);
  const VolumeIcon =
    volume === 0
      ? MDIcons.MdVolumeOff
      : volume < 35
      ? MDIcons.MdVolumeMute
      : volume < 70
      ? MDIcons.MdVolumeDown
      : MDIcons.MdVolumeUp;

  const handleChange = (newVolume: number) => {
    if (newVolume === volume) return;
    setOldVolume(volume);
    onChange(newVolume);
  };
  return (
    <div className="volume" style={{ "--i": volume } as any}>
      <VolumeIcon
        onClick={() => {
          if (volume > 0) handleChange(0);
          else handleChange(oldVolume);
        }}
      />
      <Slider
        aria-label="Volume"
        value={volume}
        size="medium"
        onChange={(_e, newVolume) => {
          handleChange(newVolume as number);
        }}
      />
    </div>
  );
};

export default Volume;
