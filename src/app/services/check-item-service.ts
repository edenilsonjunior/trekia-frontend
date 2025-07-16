import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CheckItem } from '../models/check-items/checkItem';
import { CreateCheckItemRequest } from '../models/check-items/createCheckItemRequest';

@Injectable({
  providedIn: 'root'
})
export class CheckItemService {

  private apiUrl = 'http://localhost:8080/api/trips';

  constructor(private http: HttpClient) { }

  getCheckItemsByTripId(tripId: number): Observable<CheckItem[]> {

    const url = `${this.apiUrl}/${tripId}/check-items`;
    return this.http.get<CheckItem[]>(url);
  }

  createCheckItem(tripId: number, item: CreateCheckItemRequest): Observable<HttpResponse<any>> {

    const url = `${this.apiUrl}/${tripId}/check-items`;
    return this.http.post<any>(url, item, { observe: 'response' });
  }

  toggleCheckItemChecked(tripId: number, checkItemId: number): Observable<any> {

    const url = `${this.apiUrl}/${tripId}/check-items/${checkItemId}/toggle`;
    return this.http.patch<any>(url, { observe: 'response' });
  }

  deleteCheckItem(tripId: number, checkItemId: number): Observable<any> {

    const url = `${this.apiUrl}/${tripId}/check-items/${checkItemId}`;

    return this.http.delete<any>(url, { observe: 'response' });
  }
}
