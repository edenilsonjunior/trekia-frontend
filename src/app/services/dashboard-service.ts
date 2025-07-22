import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { DashboardTrip } from '../models/dashboard/dashboardTrip';
import { Weather } from '../models/dashboard/weather';
import { Currency } from '../models/dashboard/currency';
import { CurrencyCodes } from '../models/dashboard/currencyCodes';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private apiUrl = 'http://localhost:8080/api/dashboard';

  constructor(private http: HttpClient) { }

  getTripsByUserId(): Observable<DashboardTrip[]> {

    const url = `${this.apiUrl}/trips`;
    return this.http.get<DashboardTrip[]>(url);
  }

  getWeather(latitude: number, longitude: number): Observable<{ data: Weather }> {

    const url = `${this.apiUrl}/weather`;
    const params = { latitude: latitude.toString(), longitude: longitude.toString() };

    return this.http.get<{ data: Weather }>(url, { params });
  }

  getCurrency(from: string, to: string): Observable<Currency> {

    const url = `${this.apiUrl}/currencies`;
    const params = { from: from.toString(), to: to.toString() };

    return this.http.get<Currency>(url, { params });
  }

getCurrencyCodes(): Observable<CurrencyCodes> {
  const url = `${this.apiUrl}/currencies/codes`;

  return this.http.get<CurrencyCodes>(url);
}

}