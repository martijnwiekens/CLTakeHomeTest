import Head from "next/head";
import Link from "next/link";
import React, { useEffect } from "react";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/solid";
import EpisodeLink from "../components/episodelink";
import { Episode } from "../types";
import { generateClient } from "aws-amplify/api";

// Remember a global timeout variable
const SEARCH_TIMEOUT = null;

// Remember the websocket subscriptions
let SUBSCRIPTION_CREATE = null;
let SUBSCRIPTION_UPDATE = null;
let SUBSCRIPTION_DELETE = null;

/** First Page of the application */
export default function HomePage(): JSX.Element {
    const [data, setData] = React.useState([]);
    const [searchTerm, setSearchTerm] = React.useState("");
    const [loading, setLoading] = React.useState(false);

    /** Fill the screen with some initial data */
    useEffect(() => {
        // Retrieve the data
        getData();

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
            next: () => getData(),
            error: (error) => console.warn(error),
        });

        // Subscribe to update of Episode
        SUBSCRIPTION_UPDATE = (
            client.graphql({
                query: "subscription onUpdateEpisode { onUpdateEpisode { id } }",
            }) as any
        ).subscribe({
            next: () => getData(),
            error: (error) => console.warn(error),
        });

        // Subscribe to deletion of Episode
        SUBSCRIPTION_DELETE = (
            client.graphql({
                query: "subscription onDeleteEpisode { onDeleteEpisode }",
            }) as any
        ).subscribe({
            next: () => getData(),
            error: (error) => console.warn(error),
        });

        // Unsubscribe when the component unmounts
        return () => {
            SUBSCRIPTION_CREATE.unsubscribe();
            SUBSCRIPTION_UPDATE.unsubscribe();
            SUBSCRIPTION_DELETE.unsubscribe();
        };
    }, []);

    /** Search for new episodes when searchTerm gets changed,
     * make sure we wait for 800ms before we search so we know
     * the user is done typing
     */
    useEffect(() => {
        // Check if we have a timeout
        if (SEARCH_TIMEOUT !== null) {
            clearTimeout(SEARCH_TIMEOUT);
        }

        // Set a new timeout
        const timeout = setTimeout(() => {
            getData();
        }, 800);

        // Clear the timeout when the component unmounts
        return () => {
            clearTimeout(timeout);
        };
    }, [searchTerm]);

    /**
     * Get the data from the API
     */
    async function getData(): Promise<any> {
        // Build the URL
        let URL = "/api/search";

        // Check if we have a search term
        if (searchTerm) {
            URL = URL + "?search=" + searchTerm;
        }

        setLoading(true);
        const result = await fetch(URL);
        const data = await result.json();
        setData(data);
        setLoading(false);
    }

    function onSearchChange(event: any): void {
        const target: HTMLInputElement = event.target;
        const searchTerm = target.value;
        setSearchTerm(searchTerm);
    }

    return (
        <main className="grid gap-4">
            <Head>
                <title>TV Online</title>
            </Head>
            <div className="flex justify-between gap-6 w-full">
                <div className="flex rounded-md border-solid items-center pl-4 border-1 border-gray-100 w-full bg-slate-600 overflow-hidden">
                    <MagnifyingGlassIcon className="h-8 w-8 text-gray-100" />
                    <input
                        type="search"
                        value={searchTerm}
                        onChange={onSearchChange}
                        className="w-full px-4 py-2 bg-slate-600"
                        placeholder="Search ..."
                    />
                    <button
                        onClick={getData}
                        className="bg-slate-600 hover:bg-slate-700 h-full p-4"
                    >
                        Search
                    </button>
                </div>
                <Link
                    href="/new"
                    className="bg-slate-600 hover:bg-slate-700 h-full p-4 rounded-md w-52 flex items-center gap-2 justify-between"
                >
                    <PlusIcon className="h-6 w-6 text-gray-100" />
                    <span>New Episode</span>
                </Link>
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
                {data && data.length === 0 && (
                    <div className="flex-1">
                        <p>No results found</p>
                    </div>
                )}
                {data &&
                    data.length > 0 &&
                    data.map((item: Episode) => (
                        <EpisodeLink key={item.id} episode={item} />
                    ))}
            </div>
        </main>
    );
}
