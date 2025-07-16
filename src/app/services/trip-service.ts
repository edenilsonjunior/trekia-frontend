import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TripRequest } from '../models/trip';
import { ScheduleRequest } from '../models/schedule';


@Injectable({
  providedIn: 'root'
})
export class TripService {

  private apiUrl = 'http://localhost:8080/api/trips';

  constructor(private http: HttpClient) { }

  public create(trip: TripRequest): Observable<HttpResponse<TripRequest>> {
    return this.http.post<TripRequest>(`${this.apiUrl}/register`, trip, {
      observe: 'response'
    });
  }

  public createSchedule(trip: ScheduleRequest): Observable<HttpResponse<ScheduleRequest>> {
    return this.http.post<ScheduleRequest>(`${this.apiUrl}/register`, trip, {
      observe: 'response'
    });
  }

}
