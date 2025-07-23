import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateTripRequest } from '../models/trips/createTripRequest';
import { Trip } from '../models/trips/trip';


@Injectable({
  providedIn: 'root'
})
export class TripService {

  private apiUrl = 'http://localhost:8080/api/trips';

  constructor(private http: HttpClient) { }

  public createTrip(trip: CreateTripRequest): Observable<HttpResponse<Trip>> {
    return this.http.post<Trip>(`${this.apiUrl}`, trip, {
      observe: 'response'
    });
  }

  public getTripById(id: number): Observable<{ data: Trip }> {
    return this.http.get<{ data: Trip }>(`${this.apiUrl}/${id}`);
  }

  public UpdateTrip(id: number, UpdateTripRequest: any): Observable<Trip> {
    return this.http.put<Trip>(`${this.apiUrl}/${id}`, UpdateTripRequest);
  }

  public deleteTrip(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  public deleteTrips(ids: number[]): Observable<any> {
    const params = ids.map(id => `ids=${id}`).join('&');
    return this.http.delete(`${this.apiUrl}/batch?${params}`);
  }
}
