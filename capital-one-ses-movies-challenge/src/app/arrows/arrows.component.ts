import { Component, OnInit } from '@angular/core';

import { ApiService } from '../services/api.service';
import { Movie } from '../models/movie.model';

@Component({
  selector: 'app-arrows',
  templateUrl: './arrows.component.html',
  styleUrls: ['./arrows.component.scss']
})
export class ArrowsComponent implements OnInit {
  // Should update based on if a search has pages before and after the current one
  hasPreviousMovies = true;
  hasNextMovies = true;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    // Updates movies to display whenever alerted by the ApiService
    this.apiService.moviesChanged.subscribe(
      (newMovies: Movie[]) => {
        // this.movies = newMovies;
      }
    );
  }

  onClickPrevious() {
    this.apiService.loadPreviousPage();
  }

  onClickNext() {
    this.apiService.loadNextPage();
  }
}
