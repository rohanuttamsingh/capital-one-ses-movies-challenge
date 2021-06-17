/**
 * The important properties that need to be displayed for each movie.
 * Not every movie has a Poster, so the posterUrl field is optional.
 */
export interface Movie {
  title: string;
  releaseDate: string;
  releaseYear: number;
  genre: string;
  director: string;
  posterUrl?: string;
}
