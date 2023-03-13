import React, { useEffect, useState } from "react";
import { Item } from "../hook/usePlaylist";
import * as MDIcons from "react-icons/md";
import * as BSIcons from "react-icons/bs";
import "./control.css";
import Volume from "./Volume";

interface Props {
  channel: Item;
  onChangeChannel: (channel: Item) => boolean;
  videoRef: React.RefObject<HTMLVideoElement>;
  playerRef: React.RefObject<HTMLDivElement>;
}

const Control: React.FC<Props> = ({
  channel,
  videoRef,
  onChangeChannel,
  playerRef
}) => {
  const [volume, setVolume] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume / 100;
    }
  }, [volume, videoRef]);

  const handleChangeChannel = (type: "prev" | "next") => {
    const indexOf = () => {
      for (var i = 0; i < channel.group.items.length; i++) {
        const child = channel.group.items[i];
        if (child!.id === channel.id) return i;
      }
      return -1;
    };
    return () => {
      var index = indexOf();
      if (index === -1) return;
      if (type === "next") {
        if (index + 1 === channel.group.items.length) index = 0;
        else index++;
      } else {
        if (index < 1) index = channel.group.items.length - 1;
        else index--;
      }
      console.log(channel.group.items[index]);
      onChangeChannel(channel.group.items[index]);
    };
  };

  useEffect(() => {
    if (playerRef.current) {
      const fullscreenElement =
        document["fullscreenElement"] ||
        document["mozFullScreenElement"] ||
        document["webkitFullscreenElement"] ||
        document["msFullscreenElement"];
      if (fullscreenElement) {
        if (!fullscreen) {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          } else if (document["mozCancelFullScreen"]) {
            document["mozCancelFullScreen"]();
          } else if (document["webkitExitFullscreen"]) {
            document["webkitExitFullscreen"]();
          }
          playerRef.current!.classList.remove("full");
        }
      } else if (fullscreen) {
        const element = playerRef.current!;
        if (element["requestFullscreen"]) {
          element["requestFullscreen"]();
        } else if (element["mozRequestFullScreen"]) {
          element["mozRequestFullScreen"]();
        } else if (element["webkitRequestFullscreen"]) {
          element["webkitRequestFullscreen"]();
        } else if (element["msRequestFullscreen"]) {
          element["msRequestFullscreen"]();
        }
        element.classList.add("full");
      }
    }
  }, [fullscreen, playerRef]);

  const FullscreenIcon = fullscreen
    ? MDIcons.MdFullscreenExit
    : MDIcons.MdFullscreen;
  return (
    <div className="control">
      <div className="right">
        <BSIcons.BsFillCaretUpFill
          className="up"
          onClick={handleChangeChannel("prev")}
        />
        <BSIcons.BsFillCaretDownFill
          className="down"
          onClick={handleChangeChannel("next")}
        />
      </div>
      <div className="footer">
        <Volume volume={volume} onChange={setVolume} />
        <div className="name">
          <img src={channel.logo} alt="" />
          <h1>{channel.name}</h1>
        </div>
        <FullscreenIcon
          onClick={() => {
            setFullscreen((s) => !s);
          }}
          className="fullscreen"
        />
      </div>
    </div>
  );
};

export default Control;
