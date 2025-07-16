import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GeocodingResult } from '../models/external/geocodingResult';

@Injectable({
  providedIn: 'root'
})
export class GeocodingService {

  constructor(private http: HttpClient) { }

  private apiUrl = 'https://nominatim.openstreetmap.org';

  public getLocale(locale: string): Observable<GeocodingResult[]> {

    const url = `${this.apiUrl}/search?q=${encodeURIComponent(locale)}&format=json`;
    return this.http.get<GeocodingResult[]>(url);
  }

}
