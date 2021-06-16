/**
 * The properties that a search result will have when querying the API "By Search."
 * Not every result has a "Poster" tag, so that field is optional.
 */
export interface BySearchResultModel {
  Response: boolean;
  Search: {
    Title: string;
    Year: string;
    imdbID: string;
    Type: string;
    Poster?: string;
  }[];
  totalResults: number;
}
