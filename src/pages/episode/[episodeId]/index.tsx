import React, { useEffect } from "react";
import { Episode } from "../../../types";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import { generateClient } from "aws-amplify/api";

// Remember the websocket subscriptions
let SUBSCRIPTION_CREATE = null;
let SUBSCRIPTION_UPDATE = null;
let SUBSCRIPTION_DELETE = null;

export default function EpisodePage(): JSX.Element {
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

    /** Fill the screen with some initial data */
    useEffect(() => {
        //
        // Subscribe to changes
        //
        // Create Amplify WebSocket client
        const client = generateClient();

        // Subscribe to creation of Episode
        SUBSCRIPTION_CREATE = (
            client.graphql({
                query: "subscription OnCreateEpisode { onCreateEpisode { id } }",
            }) as any
        ).subscribe({
            next: () => getEpisode(),
            error: (error) => console.warn(error),
        });

        // Subscribe to update of Episode
        SUBSCRIPTION_UPDATE = (
            client.graphql({
                query: "subscription onUpdateEpisode { onUpdateEpisode { id } }",
            }) as any
        ).subscribe({
            next: () => getEpisode(),
            error: (error) => console.warn(error),
        });

        // Subscribe to deletion of Episode
        SUBSCRIPTION_DELETE = (
            client.graphql({
                query: "subscription onDeleteEpisode { onDeleteEpisode { id } }",
            }) as any
        ).subscribe({
            next: () => getEpisode(),
            error: (error) => console.warn(error),
        });

        // Unsubscribe when the component unmounts
        return () => {
            SUBSCRIPTION_CREATE.unsubscribe();
            SUBSCRIPTION_UPDATE.unsubscribe();
            SUBSCRIPTION_DELETE.unsubscribe();
        };
    }, []);

    /** Retrieve the current episode from the API */
    async function getEpisode(): Promise<void> {
        // Retrieve the episode ID from the URL
        const episodeId = router.query.episodeId.toString();

        // Send the request to the API
        const result = await fetch(`/api/episode/${episodeId}`);
        const data = await result.json();
        setEpisodeData(data);
    }

    async function deleteEpisode(): Promise<void> {
        // Ask the user for confirmation
        if (window.confirm("Are you sure you want to delete this episode?")) {
            // Send the request to the API
            const result = await fetch(`/api/episode/${episodeData.id}`, {
                method: "DELETE",
            });
            const data = await result.json();

            // Check if we succeeded
            if (result.status === 200) {
                // Create an notification
                const event = new CustomEvent("TO_NOTIFICATION", {
                    detail: { text: "Episode deleted" },
                });
                window.dispatchEvent(event);

                // Redirect to the home page
                router.push("/");
            } else {
                // Create an notification
                const event = new CustomEvent("TO_NOTIFICATION", {
                    detail: { text: "Something went wrong" },
                });
                window.dispatchEvent(event);
            }
        }
    }

    return (
        <main className="grid gap-4">
            <Head>
                <title>
                    {episodeData
                        ? episodeData.series
                            ? episodeData.series
                            : "episode"
                        : "episode"}{" "}
                    | TVOnline
                </title>
            </Head>

            <div className="flex gap-4">
                <img
                    src={episodeData?.imageUrl ? episodeData?.imageUrl : ""}
                    alt="Episode poster"
                    className="w-64 h-72"
                />

                <div className="flex flex-col gap-2 w-full">
                    <div className="flex justify-between gap-4 items-center">
                        <h1 className="text-4xl font-bold">
                            {episodeData?.series} S{episodeData?.seasonNumber}E
                            {episodeData?.episodeNumber} - {episodeData?.title}
                        </h1>
                        <div className="flex gap-2">
                            <div className="hover:text-gray-300">
                                <button>
                                    <EyeIcon className="w-6 h-6" />
                                </button>
                            </div>
                            <Link
                                href={"/episode/" + episodeData?.id + "/update"}
                                className="hover:text-gray-300"
                            >
                                <PencilIcon className="w-6 h-6" />
                            </Link>
                            <div className="hover:text-gray-300">
                                <button onClick={deleteEpisode}>
                                    <TrashIcon className="w-6 h-6" />
                                </button>
                            </div>
                        </div>
                    </div>
                    <span className="text-gray-300">
                        {new Date(
                            episodeData?.releaseDate
                        ).toLocaleDateString()}
                    </span>
                    <p>{episodeData?.description}</p>
                    <div className="flex">
                        <Link
                            href={
                                "https://imdb.com/title/" + episodeData?.imdbId
                            }
                            className="bg-slate-600 hover:bg-slate-700 px-4 py-2 rounded-md"
                        >
                            IMDB
                        </Link>
                    </div>
                    <dl className="grid grid-cols-2 gap-2">
                        <dt className="font-bold">Director</dt>
                        <dd>{episodeData?.director}</dd>
                        <dt className="font-bold">Writer</dt>
                        <dd>{episodeData?.writer}</dd>
                        <dt className="font-bold">Actors</dt>
                        <dd>{episodeData?.actors}</dd>
                        <dt className="font-bold">Rating</dt>
                        <dd>{episodeData?.imdbRating}</dd>
                    </dl>
                </div>
            </div>
        </main>
    );
}
