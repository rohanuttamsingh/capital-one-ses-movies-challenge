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

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    // Updates movies to display whenever alerted by the ApiService
    this.apiService.moviesChanged.subscribe(
      (newMovies: Movie[]) => {
        this.movies = newMovies;
      }
    );
  }

}
