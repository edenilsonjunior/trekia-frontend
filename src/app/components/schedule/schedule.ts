import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { Sched } from '../../models/schedules/sched';
import { CreateScheduleRequest } from '../../models/schedules/createScheduleRequest';
import { ToastComponent } from '../toast/toast';
import { GeocodingService } from '../../services/geocoding-service';
import { DashboardService } from '../../services/dashboard-service';
import { ScheduleService } from '../../services/schedule-service';
import { TripService } from '../../services/trip-service';

@Component({
  selector: 'app-schedule',
  imports: [ReactiveFormsModule, DatePipe, CommonModule, FormsModule, RouterLink, ToastComponent],
  templateUrl: './schedule.html',
  styleUrl: './schedule.scss'
})
export class Schedule implements OnInit {

  alertAll = false;
  formSchedule: FormGroup;
  currencyCodes: { [key: string]: string } = {};
  currencyOptions: Array<{ code: string, label: string }> = [];
  selectedSchedulesIds: number[] = [];
  schedules: Sched[] = [];
  tripId!: number;
  tripName!: string;
  searchLocaleError = false;

  query = '';
  loading = false;
  locale = '';
  latitude?: number;
  longitude?: number;

  toastMessage = '';
  toastType: 'success' | 'error' = 'success';
  showToast = false;

  filters = {
    title: '',
    description: '',
    currencyCode: '',
  };

  constructor(
    private scheduleService: ScheduleService,
    private geocodingService: GeocodingService,
    private dashboardService: DashboardService,
    private tripService: TripService,
    private route: ActivatedRoute
  ) {
    this.formSchedule = new FormGroup({
      title: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      currencyCode: new FormControl('', [Validators.required]),
    });

    this.populateCurrencyCodes();
  }

  ngOnInit(): void {
    this.tripId = Number(this.route.snapshot.paramMap.get('id'));
    this.getTripName()
    this.loadSchedules();
  }

  get filteredSchedules(): Sched[] {
    return this.schedules.filter(trip => {
      return (
        (!this.filters.title || trip.title?.toLowerCase().includes(this.filters.title.toLowerCase())) &&
        (!this.filters.description || trip.description?.toLowerCase().includes(this.filters.description.toLowerCase())) &&
        (!this.filters.currencyCode || trip.currencyCode?.toLowerCase().includes(this.filters.currencyCode.toLowerCase()))
      );
    });
  }

  getTripName() {
    this.tripService.getTripById(this.tripId).subscribe({
      next: (trip) => {
        this.tripName = trip.data.title;
      },
      error: () => {
        this.tripName = '';
      }
    });
  }

  loadSchedules() {
    this.scheduleService.getSchedulesByTripId(this.tripId).subscribe({
      next: (schedules) => {
        this.schedules = schedules.data;
      },
      error: () => {
        this.schedules = [];
      }
    });
  }

  onSubmit() {
    if (
      this.formSchedule.valid &&
      this.latitude &&
      this.longitude
    ) {
      this.searchLocaleError = false;

      const schedule: CreateScheduleRequest = {
        title: this.formSchedule.value.title,
        description: this.formSchedule.value.description,
        latitude: this.latitude,
        longitude: this.longitude,
        currencyCode: this.formSchedule.value.currencyCode
      };

      this.scheduleService.createSchedule(this.tripId, schedule).subscribe({
        next: () => {
          this.loadSchedules();
          this.formSchedule.reset();

          const modal = document.getElementById('my_modal_4') as HTMLDialogElement;
          if (modal) modal.close();

          this.showToastMessage('Erro ao adicionar roteiro', 'error');
        },
        error: () => {
          this.formSchedule.reset()
          this.alertAll = true;
        },
        complete: () => this.formSchedule.reset()
      });
    } else {
      this.alertAll = true;
      if (!this.latitude && !this.longitude) {
        this.searchLocaleError = true;
      }
    }
  }

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

  toggleScheduleSelection(scheduleId: number, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      if (!this.selectedSchedulesIds.includes(scheduleId)) {
        this.selectedSchedulesIds.push(scheduleId);
      }
    } else {
      this.selectedSchedulesIds = this.selectedSchedulesIds.filter(id => id !== scheduleId);
    }
  }

  deleteSelectedSchedules() {
    if (this.selectedSchedulesIds.length === 0) return;

    let error = false

    for (const scheduleId of this.selectedSchedulesIds) {
      this.scheduleService.deleteSchedule(this.tripId, scheduleId).subscribe({
        next: () => {
          this.loadSchedules();

        },
        error: (err) => {
          this.showToastMessage(`Erro ao excluir roteiro`, 'error');
          error = true
        }
      });
    }

    if (!error) {
      this.showToastMessage('Roteiro(s) excluído(s) com sucesso!', 'success');
    }

    this.selectedSchedulesIds = [];
  }

  searchLocation() {
    if (!this.query) return;

    this.loading = true;
    this.locale = '';
    this.latitude = undefined;
    this.longitude = undefined;

    this.geocodingService.getLocale(this.query).subscribe({
      next: results => {
        if (!results.length) {
          this.loading = false;
          this.searchLocaleError = true;
          return;
        }

        const { lat, lon, display_name } = results[0];
        this.locale = display_name.split(',')[0];
        this.latitude = +lat;
        this.longitude = +lon;

        this.loading = false;
        this.searchLocaleError = false;
      },
      error: () => {
        this.searchLocaleError = true;
        this.loading = false;
      }
    });
  }

  showToastMessage(message: string, type: 'success' | 'error' = 'success') {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;
    setTimeout(() => this.showToast = false, 3000);
  }

}
