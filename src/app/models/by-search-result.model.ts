/**
 * The properties that a search result will have when querying the API "By Search."
 * Note: not every result in Search will have every field.
 */
export interface BySearchResultModel {
  Response: string;
  Search: {
    Title: string;
    Year: string;
    imdbID: string;
    Type: string;
    Poster: string;
  }[];
  totalResults: number;
}
