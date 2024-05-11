import { NextApiRequest, NextApiResponse } from "next";

// Cache for OMDB API
// We have a 1000 request limit per day
// Better to use a cache
const OMDB_CACHE = {}

export default async function GET(req: NextApiRequest, res: NextApiResponse): Promise<any> {
    // Find the search string in the query params as string
    const searchTerm = req.query.search as string;

    // Search AppSync for the Episode
    console.debug("Requesting AppSync for Episodes: " + searchTerm);
    const result = await fetch(process.env.NEXT_PUBLIC_APPSYNC_API_URL, {
        "method": "POST",
        "headers": {
            "Content-Type": "application/json",
            "x-api-key": process.env.NEXT_PUBLIC_APPSYNC_API_KEY,
        },
        "body": JSON.stringify({
            "query": `
                query SearchEpisodes($searchTerm: String) {
                    listEpisodes(search: $searchTerm) {
                        id
                        series
                        title
                        description
                        seasonNumber
                        episodeNumber
                        releaseDate
                        imdbId
                    }
                }
            `,
            "variables": {
                "searchTerm": searchTerm,
            },
        }),
    });
    const data = await result.json();

    // Get for each episode some extra data
    const enhancedData = [];
    data.data.listEpisodes.forEach(async episode => {
        // Retrieve the episode ID from the URL
        const episodeId = episode.imdbId;

        // Check if we already have the data
        let extraData: any = {};
        if (episodeId in OMDB_CACHE) {
            // Add the episode data to the list
            extraData = OMDB_CACHE[episodeId];
        } else {
            // Send the request to the API
            const requestUrl = `http://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&i=${episodeId}`;
            console.debug("Requesting OMDB: " + requestUrl);
            const result = await fetch(requestUrl);
            extraData = await result.json();
            if (extraData.Response !== "False") {
                OMDB_CACHE[episodeId] = extraData;
            }
        }

        // Add the episode data to the list
        enhancedData.push({
            ...episode,
            imageUrl: extraData?.Poster,
        });

        // Check if we have reached the limit
        if (enhancedData.length === data.data.listEpisodes.length) {
            return res.json(enhancedData);
        }
    });
}
