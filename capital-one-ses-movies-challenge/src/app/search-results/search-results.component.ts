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
}
