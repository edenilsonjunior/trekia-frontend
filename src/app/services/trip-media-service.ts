import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TripMedia } from '../models/trip-media/tripMedia';

@Injectable({
    providedIn: 'root'
})
export class TripMediaService {

    private apiUrl = 'http://localhost:8080/api/trips';

    constructor(private http: HttpClient) { }

    createTripMedia(tripId: number, formData: FormData): Observable<TripMedia> {
        return this.http.post<TripMedia>(`${this.apiUrl}/${tripId}/media`, formData);
    }

    getTripMediaByTripId(tripId: number): Observable<{ data: TripMedia[] }> {
        return this.http.get<{ data: TripMedia[] }>(`${this.apiUrl}/${tripId}/media`);
    }

    deleteTripMedia(tripId: number, mediaId: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${tripId}/media/${mediaId}`);
    }
}