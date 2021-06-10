import { Component, Input, OnInit } from '@angular/core';

import { Movie } from '../../models/movie.model';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss']
})
export class SearchResultComponent implements OnInit {
  @Input() movie: Movie = {
    title: 'default',
    releaseDate: 'default',
    genre: 'default',
    director: 'default'
  };

  constructor() { }

  ngOnInit(): void { }

}
