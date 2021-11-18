import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GeoService {

  constructor(private http: HttpClient) { }



  public getLocations() {
    return this.http.get('http://localhost:8080/api/maps/locations');
  }

  public addLocation(response) {
    return this.http.post('http://localhost:8080/api/maps', response);
  }

}
