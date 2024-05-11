import { NextApiRequest, NextApiResponse } from "next";

// Cache for OMDB API
// We have a 1000 request limit per day
// Better to use a cache
const OMDB_CACHE = {};


export default async function Process(req: NextApiRequest, res: NextApiResponse): Promise<any> {
    if (req.method === "DELETE") {
        return await DELETE(req, res);
    } else {
        return await GET(req, res);
    }
};


export async function DELETE(req: NextApiRequest, res: NextApiResponse): Promise<any> {
    // Find the search string in the query params as string
    const episodeId = req.query.episodeId as string;

    // Search AppSync for the Episode
    const result = await fetch(process.env.APPSYNC_API_URL, {
        "method": "POST",
        "headers": {
            "Content-Type": "application/json",
            "x-api-key": process.env.APPSYNC_API_KEY,
        },
        "body": JSON.stringify({
            "query": `
                mutation DeleteEpisode($episodeId: String!) {
                    deleteEpisode(episodeId: $episodeId)
                }
            `,
            "variables": {
                "episodeId": episodeId,
            },
        }),
    });

    // Check if there are any errors
    const resultData = await result.json();
    if ("errors" in resultData) {
        return res.status(400).json(resultData.errors);
    }

    // Check if we succeeded
    return res.json({ "result": resultData.data.deleteEpisode });
}


export async function GET(req: NextApiRequest, res: NextApiResponse): Promise<any> {
    // Find the search string in the query params as string
    const episodeId = req.query.episodeId as string;

    // Search AppSync for the Episode
    const result = await fetch(process.env.APPSYNC_API_URL, {
        "method": "POST",
        "headers": {
            "Content-Type": "application/json",
            "x-api-key": process.env.APPSYNC_API_KEY,
        },
        "body": JSON.stringify({
            "query": `
                query GetEpisode($episodeId: String!) {
                    getEpisodeById(episodeId: $episodeId) {
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
                "episodeId": episodeId,
            },
        }),
    });
    const data = await result.json();

    // Check if there are any errors
    if ("errors" in data) {
        return res.status(404).json(data.errors);
    }
    const episodeData = data.data.getEpisodeById;
    const episodeImdb = episodeData.imdbId;

    // Check if we already have the data
    let extraData: any = {};
    if (episodeImdb in OMDB_CACHE) {
        // Add the episode data to the list
        extraData = OMDB_CACHE[episodeImdb];
    } else {
        // Send the request to the API
        const requestUrl = `http://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&i=${episodeImdb}`;
        const result = await fetch(requestUrl);
        extraData = await result.json();
        if (extraData.Response !== "False") {
            OMDB_CACHE[episodeImdb] = extraData;
        }
    }

    return res.json({
        ...episodeData,
        imageUrl: extraData?.Poster,
        writer: extraData?.Writer,
        director: extraData?.Director,
        actors: extraData?.Actors,
        imdbRating: extraData?.imdbRating,
    });
}
