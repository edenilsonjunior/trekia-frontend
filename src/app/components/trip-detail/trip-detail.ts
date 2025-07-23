import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TripService } from '../../services/trip-service';
import { Trip } from '../../models/trips/trip';
import { CommonModule } from '@angular/common';
import { TripMediaService } from '../../services/trip-media-service';
import { TripMedia } from '../../models/trip-media/tripMedia';
import { CheckItem } from '../../models/check-items/checkItem';
import { ScheduleService } from '../../services/schedule-service';
import { CheckItemService } from '../../services/check-item-service';
import { TripMapComponent } from '../trip-map/trip-map';
import { DashboardSchedule } from '../../models/dashboard/dashboardSchedule';

@Component({
  selector: 'app-trip-detail',
  templateUrl: './trip-detail.html',
  styleUrls: ['./trip-detail.scss'],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, TripMapComponent, RouterLink]
})
export class TripDetail implements OnInit {

  tripId: number = 0;
  trip?: Trip;
  tripMedias: TripMedia[] = [];
  checkItems: CheckItem[] = [];
  schedules: DashboardSchedule[] = [];

  formTrip!: FormGroup;
  uploading: boolean = false;

  selectedFile?: File;
  uploadDescription: string = '';
  previewUrl: string | null = null;

  newCheckItemDescription: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tripService: TripService,
    private tripMediaService: TripMediaService,
    private scheduleService: ScheduleService,
    private checkItemService: CheckItemService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.tripId = Number(this.route.snapshot.paramMap.get('id'));
    if (!this.tripId) {
      this.router.navigate(['/trips']);
      return;
    }
    this.loadTrip();
  }

  // ----- TRIP ----- //
  loadTrip() {
    this.tripService.getTripById(this.tripId).subscribe({
      next: (trip) => {
        this.trip = trip.data;
        this.formTrip = this.fb.group({
          title: [this.trip.title, [Validators.required]],
          description: [this.trip.description, [Validators.required]],
          startDate: [this.formatDate(this.trip.startDate), [Validators.required]],
          endDate: [this.formatDate(this.trip.endDate), [Validators.required]]
        });
      },
      error: () => {
        alert('Erro ao carregar viagem');
        this.router.navigate(['/trips']);
      }
    });
    this.loadTripMedia();
    this.loadCheckItems();
    this.loadSchedules();
  }

  updateTrip() {
    if (this.formTrip.valid && this.trip) {
      const updatedTrip = {
        ...this.trip,
        ...this.formTrip.value
      };
      this.tripService.UpdateTrip(this.tripId, updatedTrip).subscribe({
        next: () => {
          this.closeUpdateTripModal();
          this.loadTrip();
        },
        error: () => {
          alert('Erro ao atualizar viagem');
        }
      });
    }
  }

  deleteTrip() {
    if (!confirm('Tem certeza que deseja excluir esta viagem?')) return;
    this.tripService.deleteTrip(this.tripId).subscribe({
      next: () => {
        alert('Viagem excluída com sucesso');
        this.router.navigate(['/trips']);
      },
      error: (err) => {
        console.error('Erro ao excluir viagens', err);
      }
    });
  }

  // ----- SCHEDULES ----- //
  loadSchedules() {
    this.scheduleService.getSchedulesByTripId(this.tripId).subscribe({
      next: (schedules) => {

        this.schedules = schedules.data.map(schedule => ({
          id: schedule.id,
          tripName: this.trip?.title || '',
          plannedAt: schedule.plannedAt,
          title: schedule.title,
          description: schedule.description,
          latitude: schedule.latitude,
          longitude: schedule.longitude,
          currentLocalBalance: schedule.currentLocalBalance,
          currencyCode: schedule.currencyCode,
          minTemperature: schedule.minTemperature,
          maxTemperature: schedule.maxTemperature,
          precipitationChance: schedule.precipitationChance
        } as DashboardSchedule));
      },
      error: (er) => {
        this.schedules = [];
      }
    });
  }

  createSchedule() {
  }

  updateSchedule(schedule: DashboardSchedule) {
  }

  deleteSchedule(scheduleId: number) {
  }

  // ----- TRIP MEDIA ----- //
  loadTripMedia() {
    if (!this.tripId) return;
    this.tripMediaService.getTripMediaByTripId(this.tripId).subscribe({
      next: (medias) => {
        this.tripMedias = medias.data;
      },
      error: () => {
        this.tripMedias = [];
      }
    });
  }

  onFileSelected(event: any) {
    if (!event.target.files?.length) return;
    this.selectedFile = event.target.files[0];

    // Preview da imagem
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.previewUrl = e.target.result;
    };
    reader.readAsDataURL(this.selectedFile!);
  }

  createTripMedia() {
    if (!this.selectedFile) return;
    this.uploading = true;
    const formData = new FormData();
    formData.append('media', this.selectedFile);
    formData.append('description', this.uploadDescription ?? '');

    this.tripMediaService.createTripMedia(this.tripId, formData).subscribe({
      next: () => {
        this.closeUploadModal();
        this.loadTripMedia();
        this.uploading = false;
        this.selectedFile = undefined;
        this.uploadDescription = '';
        this.previewUrl = null;
      },
      error: () => {
        alert('Erro ao enviar foto');
        this.uploading = false;
      }
    });
  }

  deleteTripMedia(mediaId: number) {
    if (!confirm('Tem certeza que deseja excluir esta foto?')) return;
    this.tripMediaService.deleteTripMedia(this.tripId, mediaId).subscribe({
      next: () => {
        this.loadTripMedia();
      },
      error: () => {
        alert('Erro ao excluir foto');
      }
    });
  }


  // ----- CHECK ITEMS ----- //
  loadCheckItems() {
    this.checkItemService.getCheckItemsByTripId(this.tripId).subscribe({
      next: (checkItems) => {
        this.checkItems = checkItems.data;
      },
      error: () => {
        this.checkItems = [];
      }
    });
  }

  createCheckItem() {
    const description = this.newCheckItemDescription.trim();
    if (!description) return;

    this.checkItemService.createCheckItem(this.tripId, { description }).subscribe({
      next: () => {
        this.newCheckItemDescription = '';
        this.loadCheckItems();
      },
      error: () => {
        alert('Erro ao adicionar checkitem');
      }
    });
  }

  toggleCheckItem(item: CheckItem) {

    item.isChecked = !item.isChecked;

    this.checkItemService.toggleCheckItemChecked(this.tripId, item.id,).subscribe({
      next: () => { },
      error: (er) => {
        alert('Erro ao atualizar checkitem');

        item.isChecked = !item.isChecked;
      }
    });
  }

  deleteCheckItem(item: CheckItem) {

    this.checkItemService.deleteCheckItem(this.tripId, item.id).subscribe({
      next: () => {
        this.loadCheckItems();
      },
      error: () => {
        alert('Erro ao excluir checkitem');
      }
    });
  }

  // ----- MODALS E UTILS----- //
  openUpdateTripModal() {
    if (this.trip && this.formTrip) {
      this.formTrip.patchValue({
        title: this.trip.title,
        description: this.trip.description,
        startDate: this.formatDate(this.trip.startDate),
        endDate: this.formatDate(this.trip.endDate)
      });
      this.formTrip.markAsPristine();
    }
    const modal = document.getElementById('edit_trip_modal') as HTMLDialogElement;
    if (modal) modal.showModal();
  }

  closeUpdateTripModal() {
    const modal = document.getElementById('edit_trip_modal') as HTMLDialogElement;
    if (modal) modal.close();
  }

  openUploadModal() {
    this.selectedFile = undefined;
    this.uploadDescription = '';
    this.previewUrl = null;
    const modal = document.getElementById('upload_photo_modal') as HTMLDialogElement;
    if (modal) modal.showModal();
  }

  closeUploadModal() {
    const modal = document.getElementById('upload_photo_modal') as HTMLDialogElement;
    if (modal) modal.close();
  }

  formatDate(date: string) {
    if (!date) return '';
    return date.split('T')[0];
  }
}
