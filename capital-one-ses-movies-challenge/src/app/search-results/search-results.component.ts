import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { from } from 'rxjs';
import { concatMap } from 'rxjs/operators';

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

  showingAll = false;

  filterByYearForm = new FormGroup({ 'default': new FormControl('') });

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
        this.showingAll = false;

        this.filterByYearForm = new FormGroup({
          'filterByYear': new FormControl(false, [Validators.required]),
          'startYear': new FormControl('', [Validators.required]),
          'endYear': new FormControl('', [Validators.required])
        })
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

    // GETs basic info about each matching movie and pushes that info into the array of movies results
    this.http.get<BySearchResultModel>(this.baseUrl, { params: searchParams })
      .subscribe((searchResults: BySearchResultModel) => {
        if (searchResults.Response === 'False') {
          // Indicates that there were no matching movies
          this.hasResponses = false;
          this.totalResults = 0;
        } else {
          // Indicates that there were matching movies
          this.hasResponses = true;

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

  /**
   * Updates results to include the movies on all pages, not just the selected page.
   */
  onClickShowMore() {
    this.showAllMovies();
  }

  /**
   * GETs basic info about every movie on any page with a matching title as the user's query, and pushes this
   * info to the array of movies results to be displayed. Optional parameters allow the user to specify an inclusive
   * range of years, and only movies released within that range will be added to the array of movie results to be
   * displayed.
   */
  showAllMovies(startYear?: number, endYear?: number) {
    // Indicates that all movies are being shown for use in pagination
    this.showingAll = true;

    // Resets the array of movies results to empty it of any previous searches
    this.movies = [];

    // Array of all of the pages that need to be queried
    let pages: number[] = [];
    // 10 results per page, pages start at index 1
    for (let i = 1; i <= this.totalResults / 10 + 1; i++) {
      pages.push(i);
    }

    // Converts the pages array to an observable to work nicely with sequential HTTP requests
    const pagesObservable = from(pages);

    // Flattens pages observable using a concatMap in order to send sequential HTTP requests so that the movies results
    // are always displayed in the same order as they appear in the API
    pagesObservable.pipe(
      concatMap((page: number) => {
        let searchParams = new HttpParams();

        // Using API "By Search" option to get multiple results
        searchParams = searchParams.append('s', this.title);

        // Only searching for movies
        searchParams = searchParams.append('type', 'movie');

        // Searches the specified page
        searchParams = searchParams.append('page', page);

        // Need to append key to end of every request
        searchParams = searchParams.append('apiKey', this.apiKey);

        // GETs basic info about each matching movie
        return this.http.get<BySearchResultModel>(this.baseUrl, { params: searchParams });
      })
    ).subscribe((searchResults: BySearchResultModel) => {
      // Adds the basic movies info to the array of movies results
      for (const result of searchResults.Search) {
        if (startYear && endYear) {
          // If filtering by release year, checks that the movie is within the year range
          if (startYear <= +result.Year && +result.Year <= endYear) {
            this.movies.push({
              title: result.Title,
              releaseYear: +result.Year,
              posterUrl: result.Poster,
              imdbId: result.imdbID
            });
          }
        } else {
          // If not filtering by year, adds all matching movies to the array of movies results
          this.movies.push({
            title: result.Title,
            releaseYear: +result.Year,
            posterUrl: result.Poster,
            imdbId: result.imdbID
          });
        }
      }

      // Always sets the selected movie to the first movie in the array, so that the first movie on the first page is
      // selected regardless of the number of pages
      this.setSelectedMovie(this.movies[0]);
    });
  }

  /**
   * Shows movies on all pages that were released within the specified year range.
   */
  onSubmitFilterByYear() {
    this.showAllMovies(this.filterByYearForm.value['startYear'], this.filterByYearForm.value['endYear']);
  }
}
