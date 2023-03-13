import "./styles.css";
import usePlaylist, { Group, Item } from "./hook/usePlaylist";
import { useEffect, useRef, useState } from "react";
import ReactHlsPlayer from "react-hls-player/dist";
import Control from "./components/control";

export default function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const channelsRef = useRef<HTMLUListElement>(null);
  const [playlist, updatePlaylist] = usePlaylist("playlist-25-10");
  const [group, setGroup] = useState<Group>();
  const [channel, setChannel] = useState<Item>();
  useEffect(() => {
    setGroup((current) => {
      if (!current && playlist.groups.length > 0) return playlist.groups[0];
      return current;
    });
  }, [playlist]);

  const handleClickChannel = (item: Item) => {
    if (item.id === channel?.id) return () => {};
    return () => {
      setChannel(() => item);
      setGroup(() => item.group);
    };
  };

  const handleClickGroup = (action: "next" | "prev") => {
    return () => {
      if (!playlist.groups) return;
      setGroup((current) => {
        if (!current) {
          return playlist.groups[0];
        }
        var index = playlist.groups.findIndex((g) => g.id === current.id) || 0;
        index = action === "next" ? index + 1 : index - 1;
        if (index < 0) return playlist.groups[playlist.groups.length - 1];
        if (index === playlist.groups.length) return playlist.groups[0];
        return playlist.groups[index];
      });
    };
  };
  return (
    <div className="App">
      <ul className="channels">
        <div className="group">
          <div className="arrow left" onClick={handleClickGroup("prev")}>
            {"<"}
          </div>
          <span>{group && group.name}</span>
          <div className="arrow right" onClick={handleClickGroup("next")}>
            {">"}
          </div>
        </div>
        <ul ref={channelsRef}>
          {group &&
            group.items.map((item) => (
              <li
                id={item.id}
                className={channel?.id === item.id ? "selected" : ""}
                key={item.id}
                onClick={handleClickChannel(item)}
              >
                <img src={item.logo} alt={`${item.name} Logo`} />
                <span>{item.name}</span>
              </li>
            ))}
        </ul>
      </ul>
      <div className="player" ref={playerRef}>
        {channel && (
          <ReactHlsPlayer
            loop={true}
            width="100%"
            height="auto"
            controls={false}
            autoPlay
            src={channel?.url}
            className="loading"
            onLoadStart={(e) => {
              e.currentTarget.classList.add("loading");
            }}
            onCanPlay={(e) => {
              e.currentTarget.classList.remove("loading");
            }}
            onDoubleClick={(e) => {
              var elem = e.currentTarget! as any;
              var fullscreen =
                elem.webkitRequestFullscreen ||
                elem.mozRequestFullScreen ||
                elem.msRequestFullscreen;
              fullscreen.call(elem);
            }}
            playerRef={videoRef}
          />
        )}
        <div className="loader"></div>
        {channel && (
          <Control
            videoRef={videoRef}
            playerRef={playerRef}
            channel={channel}
            onChangeChannel={(channel) => {
              setChannel(channel);
              setGroup(channel.group);
              return true;
            }}
          />
        )}
      </div>
    </div>
  );
}
