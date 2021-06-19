import { Component, OnInit } from '@angular/core';

import { ApiService } from '../services/api.service';
import { Movie } from '../models/movie.model';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent implements OnInit {
  movies: Movie[] = [];
  selectedMovie!: Movie;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    // Updates movies to display whenever alerted by the ApiService
    this.apiService.moviesChanged.subscribe(
      (newMovies: Movie[]) => {
        this.movies = newMovies;

        // By default, shows the first result to the user
        this.selectedMovie = this.movies[0];
      }
    );
  }

  get searchHadResults() {
    return this.apiService.hasResponses;
  }

  setSelectedMovie(movie: Movie) {
    this.selectedMovie = movie;
  }

  /**
   * There is always a previous page of movies unless the user is on the first page of results.
   */
  get hasPreviousMovies() {
    return this.apiService.currentPage > 1;
  }

  /**
   * There is a next page of movies if there are movies that have not been displayed on the previous
   * or current pages.
   */
  get hasNextMovies() {
    return this.apiService.remainingResults > 0;
  }

  onClickPrevious() {
    this.apiService.loadPreviousPage();
  }

  onClickNext() {
    this.apiService.loadNextPage();
  }
}
