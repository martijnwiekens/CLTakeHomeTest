import { NextApiRequest, NextApiResponse } from "next";
import { Episode } from "../../../../types";

export default async function POST(req: NextApiRequest, res: NextApiResponse): Promise<any> {
    // Check if request is post
    if (req.method !== "POST") {
        return res.status(405).end();
    }

    // Get the episode data from the body
    const episodeData = req.body as Episode;

    // Remove the extra data fields
    delete episodeData.imageUrl;
    delete episodeData.writer;
    delete episodeData.director;
    delete episodeData.actors;
    delete episodeData.imdbRating;

    // Update the episode
    console.debug("Updating AppSync for Episode: " + episodeData.id);
    const result = await fetch(process.env.NEXT_PUBLIC_APPSYNC_API_URL, {
        "method": "POST",
        "headers": {
            "Content-Type": "application/json",
            "x-api-key": process.env.NEXT_PUBLIC_APPSYNC_API_KEY,
        },
        "body": JSON.stringify({
            "query": `
                mutation UpdateEpisode($episodeData: UpdateEpisodeInput!) {
                    updateEpisode(episode: $episodeData) {
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
                "episodeData": episodeData,
            },
        }),
    });

    // Check if there are any errors
    const resultData = await result.json();
    if ("errors" in resultData) {
        return res.status(400).json(resultData.errors);
    }

    // Check if we succeeded
    return res.json(resultData.data.createEpisode);
}
