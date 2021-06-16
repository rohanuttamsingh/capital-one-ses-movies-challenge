import { Component, OnInit } from '@angular/core';

import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-arrows',
  templateUrl: './arrows.component.html',
  styleUrls: ['./arrows.component.scss']
})
export class ArrowsComponent implements OnInit {
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

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
  }

  onClickPrevious() {
    this.apiService.loadPreviousPage();
  }

  onClickNext() {
    this.apiService.loadNextPage();
  }
}
