import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TripService } from '../../services/trip-service';
import { Trip } from '../../models/trips/trip';
import { CommonModule } from '@angular/common';
import { TripMediaService } from '../../services/trip-media-service';
import { TripMedia } from '../../models/trip-media/tripMedia';

@Component({
  selector: 'app-trip-detail',
  templateUrl: './trip-detail.html',
  styleUrls: ['./trip-detail.scss'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class TripDetail implements OnInit {

  trip?: Trip;
  tripMedias: TripMedia[] = [];
  formTrip!: FormGroup;
  tripId: number = 0;
  uploading: boolean = false;

  // Upload modal fields
  selectedFile?: File;
  uploadDescription: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tripService: TripService,
    private tripMediaService: TripMediaService,
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
  }

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

  formatDate(date: string) {
    if (!date) return '';
    return date.split('T')[0];
  }

  openEditTripModal() {
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

  closeEditTripModal() {
    const modal = document.getElementById('edit_trip_modal') as HTMLDialogElement;
    if (modal) modal.close();
  }

  editTrip() {
    if (this.formTrip.valid && this.trip) {
      const updatedTrip = {
        ...this.trip,
        ...this.formTrip.value
      };
      this.tripService.updateTrip(this.tripId, updatedTrip).subscribe({
        next: () => {
          this.closeEditTripModal();
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

  // ----------- UPLOAD -----------
  openUploadModal() {
    this.selectedFile = undefined;
    this.uploadDescription = '';
    const modal = document.getElementById('upload_photo_modal') as HTMLDialogElement;
    if (modal) modal.showModal();
  }

  closeUploadModal() {
    const modal = document.getElementById('upload_photo_modal') as HTMLDialogElement;
    if (modal) modal.close();
  }

  onFileSelected(event: any) {
    if (!event.target.files?.length) return;
    this.selectedFile = event.target.files[0];
  }

  uploadPhoto() {
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
      },
      error: () => {
        alert('Erro ao enviar foto');
        this.uploading = false;
      }
    });
  }

  deletePhoto(mediaId: number) {
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
}
