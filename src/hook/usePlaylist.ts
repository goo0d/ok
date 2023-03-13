import axios from "axios";
import { useEffect, useState } from "react";
import m3uParser from "iptv-playlist-parser";
import { v4 as uuid } from "uuid";

export interface Group {
  id: string;
  name: string;
  items: Item[];
}

export interface Item {
  id: string;
  name: string;
  logo: string;
  group: Group;
  url: string;
}

export interface Playlist {
  items: Item[];
  groups: Group[];
}

const usePlaylist = (name: string): [Playlist, (name: string) => void] => {
  const [playlist, setPlaylist] = useState<Playlist>({ groups: [], items: [] });

  const update = (name: string) => {
    axios
      .get(`/lists/${name}.m3u`)
      .then((response) => {
        const data = m3uParser.parse(response.data);
        const playlist: Playlist = { items: [], groups: [] };
        data.items.forEach((m3uItem) => {
          var group = playlist.groups.find(
            (g) => g.name.toLowerCase() === m3uItem.group.title.toLowerCase()
          );
          if (!group) {
            group = {
              id: uuid(),
              items: [],
              name: m3uItem.group.title
            };
            playlist.groups.push(group);
          }

          const item: Item = {
            id: uuid(),
            name: m3uItem.name,
            logo: m3uItem.tvg.logo,
            url: m3uItem.url,
            group
          };
          playlist.items.push(item);
          group.items.push(item);
        });
        playlist.groups = playlist.groups.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        playlist.groups.forEach(
          (g) =>
            (g.items = g.items.sort((a, b) => a.name.localeCompare(b.name)))
        );
        setPlaylist(playlist);
      })
      .catch((e) => {
        alert("Erro ao carregar a lista");
        console.error(e);
      });
  };
  useEffect(() => {
    update(name);
  }, [name]);
  return [playlist, update];
};

export default usePlaylist;
