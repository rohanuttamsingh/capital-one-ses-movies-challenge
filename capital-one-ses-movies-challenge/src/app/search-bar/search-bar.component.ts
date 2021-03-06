import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit {
  searchForm = new FormGroup({ 'default': new FormControl('') });

  constructor(private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['title']) {
        this.searchForm = new FormGroup(
          { 'title': new FormControl(params['title'], [Validators.required]) }
        );
      } else {
        this.searchForm = new FormGroup(
          { 'title': new FormControl('', [Validators.required]) }
        );
      }
    });
  }

  /**
   * Pushes the searched for title in the query parameters, which is used by the SearchResultsComponent to
   * execute a new search.
   */
  onSearchClicked() {
    if (this.searchForm.value['title'] !== '') {
      this.router.navigate([''], { queryParams: { title: this.searchForm.value['title'] } });
    }
  }
}
