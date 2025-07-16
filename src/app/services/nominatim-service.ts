import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NominatimResult } from '../models/nominatimResult';

@Injectable({
  providedIn: 'root'
})
export class NominatimService {

  constructor(private http: HttpClient) { }

  public getLocale(locale: string): Observable<NominatimResult[]> {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(locale)}&format=json`;
    return this.http.get<NominatimResult[]>(url);
  }

}
