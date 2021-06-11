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
      /* TODO: Even though title is required, can still submit form and trigger an error by
          submitting empty form */
      { 'title': new FormControl('', [Validators.required]) }
    );
  }

  /**
   * Searches for movies using the ApiService. Updates the currentPage field of the ApiService
   * instance to reflect that the first page of results is being showed (the intended behavior
   * after clicking "Search").
   */
  onSearchClicked() {
    if (this.searchForm.value['title'] !== '') {
      this.apiService.searchForMovies(this.searchForm.value['title']);
      this.apiService.currentPage = 1;
    }
  }
}
