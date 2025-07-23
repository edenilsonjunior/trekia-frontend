import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Schedule } from '../models/schedules/schedule';

@Injectable({
    providedIn: 'root'
})
export class ScheduleService {

    private apiUrl = 'http://localhost:8080/api/trips';

    constructor(private http: HttpClient) { }

    getSchedulesByTripId(tripId: number): Observable<{ data: Schedule[] }> {
        return this.http.get<{ data: Schedule[] }>(`${this.apiUrl}/${tripId}/schedules`);
    }

    getSchedulesById(tripId: number, scheduleId: number): Observable<Schedule> {
        return this.http.get<Schedule>(`${this.apiUrl}/${tripId}/schedules/${scheduleId}`);
    }

    createSchedule(tripId: number, createScheduleRequest: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/${tripId}/schedules`, createScheduleRequest);
    }

    updateSchedule(tripId: number, scheduleId: number, updateScheduleRequest: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/${tripId}/schedules/${scheduleId}`, updateScheduleRequest);
    }

    renewWeather(tripId: number, scheduleId: number): Observable<any> {
        return this.http.patch(`${this.apiUrl}/${tripId}/schedules/${scheduleId}/renew-weather`, {});
    }

    renewCurrency(tripId: number, scheduleId: number): Observable<any> {
        return this.http.patch(`${this.apiUrl}/${tripId}/schedules/${scheduleId}/renew-currency`, {});
    }

    deleteSchedule(tripId: number, scheduleId: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${tripId}/schedules/${scheduleId}`);
    }

    
    
}