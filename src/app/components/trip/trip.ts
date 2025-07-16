import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TripService } from '../../services/trip-service';
import { TripRequest } from '../../models/trip';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-trip',
  imports: [ReactiveFormsModule],
  templateUrl: './trip.html',
  styleUrl: './trip.scss'
})
export class Trip {

  alertAll = false;
  formTrip: FormGroup;

  constructor (
    private tripService: TripService
  ) {
    this.formTrip = new FormGroup({
      title: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      startDate: new FormControl('', [Validators.required]),
      endDate: new FormControl('', [Validators.required])
    });
  }

  onSubmit() {
    if (this.formTrip.valid) {
      const trip: TripRequest = {
        title: this.formTrip.value.title,
        description: this.formTrip.value.description,
        startDate: formatDate(this.formTrip.value.startDate, 'dd/MM/yyyy', 'en-US'),
        endDate: formatDate(this.formTrip.value.endDate, 'dd/MM/yyyy', 'en-US')
      };
      this.tripService.create(trip).subscribe({
        next: (response) => {
          if (response.status === 201) {
            console.log("ok", response.body);
          }
        },
        error: (error) => {
          this.formTrip.reset()
          this.alertAll = true;

          console.error('Erro ao fazer login', error);
        },
        complete: () => this.formTrip.reset()
      });
    } else {
      this.alertAll = true;
    }
  }

}
