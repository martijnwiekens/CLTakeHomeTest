import React from "react";
import { Episode } from "../types";
import Link from "next/link";

interface IEpisodeLinkProps {
    episode: Episode;
}

export default function EpisodeLink({
    episode,
}: IEpisodeLinkProps): JSX.Element {
    return (
        <Link
            href={"/episode/" + episode.id}
            className="w-72 grid rounded-md bg-slate-400 overflow-hidden shadow hover:bg-slate-300"
        >
            <img
                src={episode.imageUrl ? episode.imageUrl : ""}
                alt="Episode poster"
                className="h-72"
            />
            <div className="w-72 p-2 overflow-hidden flex flex-col">
                <span className="truncate font-bold text-lg">
                    {episode.series} S{episode.seasonNumber}E
                    {episode.episodeNumber}
                </span>
                <div className="flex w-64">
                    <span className="truncate">{episode.description}</span>
                </div>
            </div>
        </Link>
    );
}
