import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit {
  searchForm = new FormGroup({ 'default': new FormControl('') });

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.searchForm = new FormGroup(
      { 'title': new FormControl('', [Validators.required]) }
    );
  }

  /**
   * Searches for movies using the ApiService. Clears the movie results currently stored in the
   * service. Resets the current page to 1 to reflect that the first page of results is being
   * showed.
   */
  onSearchClicked() {
    if (this.searchForm.value['title'] !== '') {
      this.apiService.clearMovies();
      this.apiService.searchForMovies(this.searchForm.value['title']);
      this.apiService.currentPage = 1;
    }
  }
}
