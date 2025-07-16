import { Component } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GeocodingService } from '../../services/geocoding-service';
import { DashboardService } from '../../services/dashboard-service';

@Component({
  selector: 'app-weather-card',
  standalone: true,
  templateUrl: './weather-card.html',
  imports: [CommonModule, FormsModule],
  styleUrls: ['./weather-card.scss']
})
export class WeatherCardComponent {
  query = '';
  loading = false;
  city = 'Rio de Janeiro';
  tempMax?: string;
  tempMin?: string;
  error?: string;

  constructor(
    private geocodingService: GeocodingService,
    private dashboardService: DashboardService
  ) {}

  searchWeather() {
    if (!this.query) return;

    this.loading = true;
    this.error = undefined;
    this.city = '';
    this.tempMax = undefined;
    this.tempMin = undefined;

    this.geocodingService.getLocale(this.query).subscribe({
      next: results => {
        if (!results.length) {
          this.error = 'Local não encontrado';
          this.loading = false;
          return;
        }
        const result = results[0];
        this.city = result.display_name.split(',')[0];
        this.dashboardService.getWeather(+result.lat, +result.lon).subscribe({
          next: weather => {
            this.tempMax = weather.maxTempC.toString() ?? '--';
            this.tempMin = weather.minTempC.toString() ?? '--';
            this.loading = false;
          },
          error: () => {
            this.error = 'Erro ao buscar clima';
            this.loading = false;
          }
        });
      },
      error: () => {
        this.error = 'Erro ao buscar local';
        this.loading = false;
      }
    });
  }
}
