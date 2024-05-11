export interface Episode {
    id: string;
    series: string;
    title: string;
    description: string;
    seasonNumber: number;
    episodeNumber: number;
    releaseDate: string;
    imdbId: string;
    imageUrl?: string;
    writer?: string;
    director?: string;
    actors?: string;
    imdbRating?: string;
}
