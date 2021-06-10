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

  onSearchClicked() {
    this.apiService.searchForMovies(this.searchForm.value['title']);
  }
}
