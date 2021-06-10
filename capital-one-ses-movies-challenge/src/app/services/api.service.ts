import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

/**
 * This service handles the requests to the OMDb API.
 */
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  apiKey = '81a25063';
  baseUrl = 'http://www.omdbapi.com/';

  constructor(private http: HttpClient) {
  }

  searchForMovies(title: string) {
    let searchParams = new HttpParams();

    // Using API "By Search" option to get multiple results
    searchParams = searchParams.append('s', title);

    // Only searching for movies
    searchParams = searchParams.append('type', 'movie');

    // Need to append key to end of every request
    searchParams = searchParams.append('apiKey', this.apiKey);

    return this.http
      .get(this.baseUrl,
        {
          params: searchParams
        });
  }
}
