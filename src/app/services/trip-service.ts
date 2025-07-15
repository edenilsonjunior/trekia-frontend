import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TripService {

  private apiUrl = 'http://localhost:8080/api/trips';

  constructor(private http: HttpClient) { }

}
