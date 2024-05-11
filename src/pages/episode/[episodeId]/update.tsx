import { CircleStackIcon } from "@heroicons/react/24/solid";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { Episode } from "../../../types";

/** Page to update an existing episode to the database */
export default function UpdateEpisodePage(): JSX.Element {
    const [episodeData, setEpisodeData] = React.useState<Episode>({} as any);
    const router = useRouter();

    /** Retrieve the current episode on first load */
    useEffect(() => {
        // Check if the router is ready
        if (router.isReady) {
            // Retrieve the episode
            getEpisode();
        }
    }, [router.isReady]);

    /** Retrieve the current episode from the API */
    async function getEpisode(): Promise<void> {
        // Retrieve the episode ID from the URL
        const episodeId = router.query.episodeId.toString();

        // Send the request to the API
        const result = await fetch(`/api/episode/${episodeId}`);
        const data = await result.json();
        setEpisodeData(data);
    }

    /** Save data when a field changes */
    function onChange(event: any): void {
        // Retrieve data
        const target: HTMLInputElement = event.target;
        const name = target.name;
        const value = target.value;

        // Update the state with the new data
        setEpisodeData({
            ...episodeData,
            [name]: value,
        });
    }

    /** Update the episode */
    async function onSubmit(event: any): Promise<void> {
        // Prevent the form from submitting
        event.preventDefault();

        // Retrieve the episode ID from the URL
        const episodeId = router.query.episodeId.toString();

        // Send the data to the API
        const result = await fetch("/api/episode/" + episodeId + "/update", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(episodeData),
        });

        // Check if we succeeded
        if (result.status === 200) {
            // Create an notification
            const event = new CustomEvent("TO_NOTIFICATION", {
                detail: {
                    text: "Episode updated",
                    url: "/episode/" + episodeId,
                },
            });
            window.dispatchEvent(event);

            // Redirect the user to the episode page
            router.push("/episode/" + episodeId);
        } else {
            // Create an notification
            const event = new CustomEvent("TO_NOTIFICATION", {
                detail: { text: "Something went wrong" },
            });
            window.dispatchEvent(event);
        }
    }

    return (
        <main className="grid gap-4">
            <Head>
                <title>
                    Update{" "}
                    {episodeData
                        ? episodeData.series
                            ? episodeData.series
                            : "episode"
                        : "episode"}{" "}
                    | TVOnline
                </title>
            </Head>
            <h1 className="text-4xl font-medium">
                Update{" "}
                {episodeData
                    ? episodeData.series
                        ? episodeData.series
                        : "episode"
                    : "episode"}
            </h1>
            <Link
                href={
                    "/" +
                    (episodeData
                        ? episodeData.id
                            ? "episode/" + episodeData?.id
                            : ""
                        : "")
                }
                className="text-slate-300 hover:text-white"
            >
                &laquo; Go back
            </Link>
            <p>
                Got some new information about{" "}
                {episodeData
                    ? episodeData.series
                        ? episodeData.series
                        : "episode"
                    : "episode"}
                ? Let&apos;s update it!
            </p>

            <form className="grid gap-4" onSubmit={onSubmit}>
                <div className="flex flex-col">
                    <label className="font-bold">Serie name</label>
                    <input
                        type="text"
                        required={true}
                        name="series"
                        onChange={onChange}
                        value={episodeData?.series}
                        className="w-full px-4 py-2 bg-slate-100 rounded-md text-black"
                    />
                </div>
                <div className="flex gap-4 justify-between">
                    <div className="flex flex-col w-1/2">
                        <label className="font-bold">Season number</label>
                        <input
                            type="number"
                            min="1"
                            max="99"
                            step="1"
                            required={true}
                            name="seasonNumber"
                            onChange={onChange}
                            value={episodeData?.seasonNumber}
                            className="w-full px-4 py-2 bg-slate-100 rounded-md text-black"
                        />
                    </div>
                    <div className="flex flex-col w-1/2">
                        <label className="font-bold">Episode number</label>
                        <input
                            type="number"
                            min="1"
                            max="99"
                            step="1"
                            required={true}
                            name="episodeNumber"
                            onChange={onChange}
                            value={episodeData?.episodeNumber}
                            className="w-full px-4 py-2 bg-slate-100 rounded-md text-black"
                        />
                    </div>
                </div>
                <div className="flex gap-4 justify-between">
                    <div className="flex flex-col w-1/2">
                        <label className="font-bold">
                            Episode release date
                        </label>
                        <input
                            type="date"
                            required={true}
                            name="releaseDate"
                            onChange={onChange}
                            value={episodeData?.releaseDate}
                            className="w-full px-4 py-2 bg-slate-100 rounded-md text-black"
                        />
                    </div>
                    <div className="flex flex-col w-1/2">
                        <label className="font-bold">IMDB ID</label>
                        <input
                            type="text"
                            required={true}
                            name="imdbId"
                            onChange={onChange}
                            value={episodeData?.imdbId}
                            className="w-full px-4 py-2 bg-slate-100 rounded-md text-black"
                        />
                    </div>
                </div>
                <div className="flex flex-col">
                    <label className="font-bold">Episode title</label>
                    <input
                        type="input"
                        required={true}
                        name="title"
                        onChange={onChange}
                        value={episodeData?.title}
                        className="w-full px-4 py-2 bg-slate-100 rounded-md text-black"
                    />
                </div>
                <div className="flex flex-col">
                    <label className="font-bold">Description</label>
                    <textarea
                        required={true}
                        name="description"
                        onChange={onChange}
                        value={episodeData?.description}
                        className="w-full px-4 py-2 bg-slate-100 rounded-md text-black"
                    />
                </div>
                <div className="flex justify-center">
                    <button
                        type="submit"
                        className="flex flex-row gap-2 bg-slate-600 hover:bg-slate-700 p-4 rounded-md"
                    >
                        <CircleStackIcon className="h-6 w-6" />
                        <span>Update Episode</span>
                    </button>
                </div>
            </form>
        </main>
    );
}
