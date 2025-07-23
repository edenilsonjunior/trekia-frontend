import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardTrip } from '../../models/dashboard/dashboardTrip';
import { DashboardService } from '../../services/dashboard-service';
import { TripMapComponent } from '../trip-map/trip-map';
import { WeatherCardComponent } from '../weather/weather-card';
import { CurrencyCardComponent } from '../currency-card/currency-card';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, TripMapComponent, WeatherCardComponent, CurrencyCardComponent],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class Dashboard implements OnInit {
  trips: DashboardTrip[] = [];
  selectedTripIndex = 0;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.dashboardService.getTripsByUserId().subscribe({
      next: trips => this.trips = trips,
      error: () => this.trips = []
    });
  }

  get tripCard() {
    return this.trips[this.selectedTripIndex] || {
      title: '',
      mediaBase64: '',
      startDate: '',
      endDate: '',
      schedules: []
    };
  }

  prevTrip() {
    if (this.trips.length) {
      this.selectedTripIndex = (this.selectedTripIndex - 1 + this.trips.length) % this.trips.length;
    }
  }

  nextTrip() {
    if (this.trips.length) {
      this.selectedTripIndex = (this.selectedTripIndex + 1) % this.trips.length;
    }
  }
}
