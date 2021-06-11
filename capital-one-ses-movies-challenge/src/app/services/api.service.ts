import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { BySearchResultModel } from '../models/by-search-result.model';
import { Movie } from '../models/movie.model';
import { ByIdResultModel } from '../models/by-id-result.model';

/**
 * This service handles the requests to the OMDb API.
 */
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  apiKey = '81a25063';
  baseUrl = 'http://www.omdbapi.com/';
  moviesChanged = new Subject<Movie[]>();
  currentTitle = '';
  currentPage = 0;

  constructor(private http: HttpClient) {
  }

  /**
   * GETs detailed info about movies on the specified page that match the title parameter.
   * Informs listening components of these movies.
   * @param title Title of movie to find.
   * @param page Page of results that will be searched.
   */
  searchForMovies(title: string, page: number = 1) {
    // Stores title searched for use when getting next and previous pages
    this.currentTitle = title;

    // GETs the ID's of the movies on the specified page of results with titles that match the title
    // parameter
    this.searchForIds(title, page).subscribe(
      (resultIds) => {
        let movies: Movie[] = [];

        // Searches every matching movie by ID to get more details
        for (let id of resultIds) {
          let searchParams = new HttpParams();

          // Using API "By ID" option to get single, detailed result
          searchParams = searchParams.append('i', id);

          // Only searching for movies
          searchParams = searchParams.append('type', 'movie');

          // Need to append key to end of every request
          searchParams = searchParams.append('apiKey', this.apiKey);

          // GETs more detailed info on every matching movie
          this.http
            .get<ByIdResultModel>(
              this.baseUrl,
              { params: searchParams }
            )
            .pipe(
              map((movieResult) => {
                // Transforms query result to only store useful data
                return {
                  title: movieResult['Title'],
                  releaseDate: movieResult['Released'],
                  director: movieResult['Director'],
                  genre: movieResult['Genre'],
                  posterUrl: movieResult['Poster']
                };
              })
            )
            .subscribe(
              (movie) => {
                // Informs listening components of the new movies to display
                movies.push(movie);
                this.updateMovies(movies);
              }
            );
        }
      }
    );
  }

  // TODO: Might need to load in all movies at the same time because they sometimes load in
  // in a different order after hitting next then previous

  /**
   * GETs detailed info about movies on the next page that match the title parameter.
   * Informs listening components of these movies.
   */
  loadPreviousPage() {
    this.searchForMovies(this.currentTitle, --this.currentPage);
  }

  /**
   * GETs detailed info about movies on the previous page that match the title parameter.
   * Informs listening components of these movies.
   */
  loadNextPage() {
    this.searchForMovies(this.currentTitle, ++this.currentPage);
  }

  /**
   * Informs listening components that the movies data has been updated.
   * @param newMovies Array of new movies to display.
   * @private
   */
  private updateMovies(newMovies: Movie[]) {
    this.moviesChanged.next(newMovies.slice());
  }

  /**
   * GETs the IMDb ID's of every movie that matches the title passed in on the specified page.
   * @param title Title of movie to find.
   * @param page Page of results that will be returned.
   * @private
   */
  private searchForIds(title: string, page: number = 1) {
    let searchParams = new HttpParams();

    // Using API "By Search" option to get multiple results
    searchParams = searchParams.append('s', title);

    // Only searching for movies
    searchParams = searchParams.append('type', 'movie');

    // Searches the specified page
    searchParams = searchParams.append('page', page);

    // Need to append key to end of every request
    searchParams = searchParams.append('apiKey', this.apiKey);

    // GET the IMDb ID's of every movie that matches the user's title query and push those ID's into
    // the resultIds array in the default order they appear
    return this.http
      .get<{ [key: string]: BySearchResultModel[] }>(
        this.baseUrl,
        { params: searchParams }
      )
      .pipe(
        map((searchResults) => {
          let resultIds: string[] = [];
          for (const searchResult of searchResults['Search']) {
            resultIds.push(searchResult['imdbID']);
          }
          return resultIds;
        })
      );
  }
}
