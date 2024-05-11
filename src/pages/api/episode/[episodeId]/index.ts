import { NextApiRequest, NextApiResponse } from "next";

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
    return res.json(data.data.getEpisodeById);
}
