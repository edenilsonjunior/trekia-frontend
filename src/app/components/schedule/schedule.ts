import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GeocodingService } from '../../services/geocoding-service';
import { DashboardService } from '../../services/dashboard-service';
import { CurrencyCodes } from '../../models/dashboard/currencyCodes';
import { ScheduleService } from '../../services/schedule-service';

@Component({
  selector: 'app-schedule',
  imports: [ReactiveFormsModule],
  templateUrl: './schedule.html',
  styleUrl: './schedule.scss'
})
export class Schedule {

  alertAll = false;
  formSchedule: FormGroup;
  currencyCodes: { [key: string]: string } = {};
  currencyOptions: Array<{ code: string, label: string }> = [];

  constructor(
    private scheduleService: ScheduleService,
    private geocodingService: GeocodingService,
    private dashboardService: DashboardService
  ) {
    this.formSchedule = new FormGroup({
      title: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      currencyCode: new FormControl('', [Validators.required]),
    });

    this.populateCurrencyCodes();
  }

  onSubmit() {
    // if (this.formSchedule.valid) {
    //   const schedule: ScheduleRequest = {
    //     title: this.formSchedule.value.title,
    //     description: this.formSchedule.value.description,
    //     latitude: this.formSchedule.value.description,
    //     longitude: this.formSchedule.value.description,
    //     currencyCode: this.formSchedule.value.currencyCode
    //   };

    //   this.scheduleService.create(schedule).subscribe({
    //     next: (response) => {
    //       if (response.status === 201) {
    //         console.log("ok", response.body);
    //       }
    //     },
    //     error: (error) => {
    //       this.formSchedule.reset()
    //       this.alertAll = true;

    //       console.error('Erro ao fazer login', error);
    //     },
    //     complete: () => this.formSchedule.reset()
    //   });
    // } else {
    //   this.alertAll = true;
    // }
  }

  // searchLocationByDescription() {
  //   const desc = this.formSchedule.value.description;
  //   this.geocodingService.getLocale(desc).subscribe(coord => {
  //     this.currentLatitude = coord.;
  //     this.currentLongitude = coord.lon;
  //   });
  // }

  populateCurrencyCodes() {
    this.dashboardService.getCurrencyCodes().subscribe({
      next: res => {
        this.currencyCodes = res.data
        this.currencyOptions = Object.entries(this.currencyCodes).map(([code, label]) => ({
          code,
          label: `${code} - ${label}`
        }));
      },
      error: () => {
        this.currencyCodes = {};
        this.currencyOptions = [];
      }
    });
  }
}
