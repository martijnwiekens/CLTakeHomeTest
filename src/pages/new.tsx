import { PlusIcon } from "@heroicons/react/24/solid";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

/** Page to create new episode to the database */
export default function NewEpisodePage(): JSX.Element {
    const [episodeData, setEpisodeData] = React.useState({});
    const router = useRouter();

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

    /** Create the new episode */
    async function onSubmit(event: any): Promise<void> {
        // Prevent the form from submitting
        event.preventDefault();

        // Create an ID for the new episode
        const episodeId =
            Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15);

        // Send the data to the API
        const result = await fetch("/api/new", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ...episodeData,
                id: episodeId,
            }),
        });

        // Check if we succeeded
        if (result.status === 200) {
            // Create an notification
            const event = new CustomEvent("TO_NOTIFICATION", {
                detail: {
                    text: "Episode created",
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
                <title>Create a new Episode | TVOnline</title>
            </Head>
            <h1 className="text-4xl font-medium">Create a new Episode</h1>
            <Link href="/" className="text-slate-300 hover:text-white">
                &laquo; Go back
            </Link>
            <p>
                Can&apos;t what you are looking for in TVOnline? No problem, you
                can add episodes yourself directly in the system.
            </p>

            <form className="grid gap-4" onSubmit={onSubmit}>
                <div className="flex flex-col">
                    <label className="font-bold">Serie name</label>
                    <input
                        type="text"
                        required={true}
                        name="series"
                        onChange={onChange}
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
                        className="w-full px-4 py-2 bg-slate-100 rounded-md text-black"
                    />
                </div>
                <div className="flex flex-col">
                    <label className="font-bold">Description</label>
                    <textarea
                        required={true}
                        name="description"
                        onChange={onChange}
                        className="w-full px-4 py-2 bg-slate-100 rounded-md text-black"
                    />
                </div>
                <div className="flex justify-center">
                    <button
                        type="submit"
                        className="flex flex-row gap-2 bg-slate-600 hover:bg-slate-700 p-4 rounded-md"
                    >
                        <PlusIcon className="h-6 w-6" />
                        <span>Create Episode</span>
                    </button>
                </div>
            </form>
        </main>
    );
}
