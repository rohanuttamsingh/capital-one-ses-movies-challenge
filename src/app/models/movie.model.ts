/**
 * The important properties that need to be displayed for each movie. Not every movie has every property, so it is
 * important to check before displaying each property.
 */
export interface Movie {
  title: string;
  releaseDate: string;
  releaseYear: number;
  genre: string;
  director: string;
  posterUrl: string;
  awards: string;
  imdbRating: string;
  boxOffice: string;
  language: string;
  actors: string;
  metascore: string;
}

/**
 * The properties of a movie that are displayed in the left results panel.
 */
export interface MovieSummary {
  title: string;
  releaseYear: number;
  posterUrl: string;
  imdbId: string; // Used to look up more details on movie
}
