import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Movie, MovieSummary } from '../models/movie.model';
import { BySearchResultModel } from '../models/by-search-result.model';
import { ByIdResultModel } from '../models/by-id-result.model';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent implements OnInit {
  apiKey = '81a25063';
  baseUrl = 'http://www.omdbapi.com/';

  movies: MovieSummary[] = [];
  selectedMovie!: Movie;
  title = '';

  currentPage = 0;
  totalResults = 0;

  hasResponses = true;

  /**
   * The index in the movies array that contains the movies of the current page of results is one
   * less than the current page queried to the API because the API begins numbering pages at 1.
   */
  get moviesIndex() {
    return this.currentPage - 1;
  }

  /**
   * The movies returned by this search that are on pages greater than the current one is equal to
   * the total results displayed on this page and previous pages (10 movies a page) less than the
   * total number of results returned by the search.
   */
  get remainingResults() {
    return this.totalResults - 10 * this.currentPage;
  }

  constructor(private route: ActivatedRoute,
              private router: Router,
              private http: HttpClient) { }

  ngOnInit(): void {
    // Will search for a new title whenever a new search is executed
    this.route.queryParams.subscribe((params) => {
      if (params['title']) {
        this.title = params['title'];
        this.currentPage = 1;
        this.searchForIds(this.currentPage);
      }
    });
  }

  /**
   * GETs basic info about every movie with a matching title as the user's query, on the queried page, and pushes this
   * info to the array of movies results to be displayed.
   *
   * @param page API page to query.
   */
  searchForIds(page: number) {
    // Resets the array of movies results to empty it of any previous searches.
    this.movies = [];

    let searchParams = new HttpParams();

    // Using API "By Search" option to get multiple results
    searchParams = searchParams.append('s', this.title);

    // Only searching for movies
    searchParams = searchParams.append('type', 'movie');

    // Searches the specified page
    searchParams = searchParams.append('page', page);

    // Need to append key to end of every request
    searchParams = searchParams.append('apiKey', this.apiKey);

    // GET basic info about each matching movie and pushes that info into the array of movies results
    this.http.get<BySearchResultModel>(this.baseUrl, { params: searchParams })
      .subscribe((searchResults: BySearchResultModel) => {
        if (searchResults.Response === 'False') {
          // Indicates that there were no matching movies
          this.hasResponses = false;
        } else {
          // Keeps track of the total number of matching movies for use in pagination
          this.totalResults = searchResults.totalResults;

          // Adds the basic movies info to the array of movies results
          for (const result of searchResults.Search) {
            this.movies.push(
              {
                title: result.Title,
                releaseYear: +result.Year,
                posterUrl: result.Poster,
                imdbId: result.imdbID
              }
            );
          }

          this.setSelectedMovie(this.movies[0]);
        }
      });
  }

  setSelectedMovie(movieSummary: MovieSummary) {
    let searchParams = new HttpParams();

    // Using API "By ID" option to get single, detailed result
    searchParams = searchParams.append('i', movieSummary.imdbId);

    // Only searching for movies
    searchParams = searchParams.append('type', 'movie');

    // Need to append key to end of every request
    searchParams = searchParams.append('apiKey', this.apiKey);

    // GETs more detailed info on the matching movie
    this.http.get<ByIdResultModel>(this.baseUrl, { params: searchParams })
      .subscribe((movieResult) => {
        // Transforms query result to only store useful data
        this.selectedMovie = {
          title: movieResult.Title,
          releaseDate: movieResult.Released,
          releaseYear: +movieResult.Year,
          director: movieResult.Director,
          genre: movieResult.Genre,
          posterUrl: movieResult.Poster,
          awards: movieResult.Awards,
          imdbRating: movieResult.imdbRating,
          boxOffice: movieResult.BoxOffice,
          language: movieResult.Language,
          actors: movieResult.Actors,
          metascore: movieResult.Metascore
        };
      })
  }

  /**
   * There is always a previous page of movies unless the user is on the first page of results.
   */
  get hasPreviousMovies() {
    return this.currentPage > 1;
  }

  /**
   * There is a next page of movies if there are movies that have not been displayed on the previous
   * or current pages.
   */
  get hasNextMovies() {
    return this.remainingResults > 0;
  }

  /**
   * Updates results in the results panel to the movies on the previous API page.
   */
  onClickPrevious() {
    this.searchForIds(--this.currentPage);
  }

  /**
   * Updates results in the results panel to the movies on the next API page.
   */
  onClickNext() {
    this.searchForIds(++this.currentPage);
  }
}
