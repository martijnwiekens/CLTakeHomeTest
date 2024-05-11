import { NextApiRequest, NextApiResponse } from "next";

export default async function GET(req: NextApiRequest, res: NextApiResponse): Promise<any> {
    // Find the search string in the query params as string
    const searchTerm = req.query.search as string;

    // Search AppSync for the Episode
    const result = await fetch(process.env.APPSYNC_API_URL, {
        "method": "POST",
        "headers": {
            "Content-Type": "application/json",
            "x-api-key": process.env.APPSYNC_API_KEY,
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
    return res.json(data.data.listEpisodes);
}
