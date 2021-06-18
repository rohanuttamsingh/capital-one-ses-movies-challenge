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
  imdbRating: number;
  boxOffice: string;
  language: string;
  actors: string;
  metascore: string;
}
