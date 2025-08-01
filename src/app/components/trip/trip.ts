import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, formatDate } from '@angular/common';
import { Router } from '@angular/router';
import { ToastComponent } from '../toast/toast';

import { DashboardTrip } from '../../models/dashboard/dashboardTrip';
import { CreateTripRequest } from '../../models/trips/createTripRequest';
import { DashboardService } from '../../services/dashboard-service';
import { TripService } from '../../services/trip-service';

@Component({
  selector: 'app-trip',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, ToastComponent],
  templateUrl: './trip.html',
  styleUrl: './trip.scss'
})
export class Trip implements OnInit {

  alertAll = false;
  formTrip: FormGroup;
  trips: DashboardTrip[] = [];
  selectedTripIds: number[] = [];

  toastMessage = '';
  toastType: 'success' | 'error' = 'success';
  showToast = false;

  filters = {
    title: '',
    description: '',
    startDate: '',
    endDate: ''
  };

  constructor(
    private dashboardService: DashboardService,
    private tripService: TripService,
    private router: Router
  ) {
    this.formTrip = new FormGroup({
      title: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      startDate: new FormControl('', [Validators.required]),
      endDate: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    this.loadTrips();
  }

  get filteredTrips(): DashboardTrip[] {
    return this.trips.filter(trip => {
      return (!this.filters.title || trip.title.toLowerCase().includes(this.filters.title.toLowerCase())) &&
        (!this.filters.description || trip.description.toLowerCase().includes(this.filters.description.toLowerCase())) &&
        (!this.filters.startDate || new Date(trip.startDate) >= new Date(this.filters.startDate)) &&
        (!this.filters.endDate || new Date(trip.endDate) <= new Date(this.filters.endDate));
    });
  }

  loadTrips() {
    this.dashboardService.getTripsByUserId().subscribe({
      next: (trips) => {
        this.trips = trips;
      },
      error: (err) => {
        this.trips = [];
      }
    });
  }

  onSubmit() {
    if (this.formTrip.valid) {
      const trip: CreateTripRequest = {
        title: this.formTrip.value.title,
        description: this.formTrip.value.description,
        startDate: formatDate(this.formTrip.value.startDate, 'dd/MM/yyyy', 'en-US'),
        endDate: formatDate(this.formTrip.value.endDate, 'dd/MM/yyyy', 'en-US')
      };

      if (new Date(trip.endDate) < new Date(trip.startDate)) {
        this.alertAll = true;
        return;
      }

      this.tripService.createTrip(trip).subscribe({
        next: (response) => {

          this.loadTrips();
          this.formTrip.reset();

          const modal = document.getElementById('my_modal_3') as HTMLDialogElement;
          if (modal) modal.close();

          this.showToastMessage('Viagem adicionada com sucesso!', 'success');

        },
        error: (error) => {
          this.alertAll = true;
          this.showToastMessage('Erro ao criar viagem', 'error');
        }
      });
    } else {
      this.alertAll = true;
    }
  }

  toggleTripSelection(tripId: number, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      if (!this.selectedTripIds.includes(tripId)) {
        this.selectedTripIds.push(tripId);
      }
    } else {
      this.selectedTripIds = this.selectedTripIds.filter(id => id !== tripId);
    }
  }

  deleteSelectedTrips() {
    if (this.selectedTripIds.length === 0) return;

    this.tripService.deleteTrips(this.selectedTripIds).subscribe({
      next: () => {
        this.loadTrips();
        this.selectedTripIds = [];

        this.showToastMessage('Viagem(ns) excluída(s) com sucesso!', 'success');

      },
      error: (err) => {
        this.showToastMessage('Erro ao excluir viagens', 'error');
      }
    });
  }

  goToTripDetail(tripId: number) {
    this.router.navigate(['/trips', tripId]);
  }

  showToastMessage(message: string, type: 'success' | 'error' = 'success') {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;
    setTimeout(() => this.showToast = false, 3000);
  }
}
