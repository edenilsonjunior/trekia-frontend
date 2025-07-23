import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
export class WeatherCardComponent implements OnInit {
  query = 'Araraquara';
  loading = false;
  city = 'Araraquara';
  tempMax?: string;
  tempMin?: string;
  error?: string;

  constructor(
    private geocodingService: GeocodingService,
    private dashboardService: DashboardService
  ) {}
  
  ngOnInit(): void {
    this.searchWeather();
  }

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
          next: (weather) => {

            if (!weather || weather.data.maxTempC == null || weather.data.minTempC == null) {
              this.error = 'Dados de temperatura não disponíveis';
              this.loading = false;
              return;
            }

            this.tempMax = String(weather.data.maxTempC);
            this.tempMin = String(weather.data.minTempC);
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
