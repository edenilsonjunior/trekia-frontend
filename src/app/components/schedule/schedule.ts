import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ScheduleService } from '../../services/schedule-service';
import { NominatimService } from '../../services/nominatim-service';
import { ScheduleRequest } from '../../models/schedule';

@Component({
  selector: 'app-schedule',
  imports: [ReactiveFormsModule],
  templateUrl: './schedule.html',
  styleUrl: './schedule.scss'
})
export class Schedule {

  alertAll = false;
  formSchedule: FormGroup;

  constructor (
    private scheduleService: ScheduleService,
    private nominatimService: NominatimService
  ) {
    this.formSchedule = new FormGroup({
      title: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      currencyCode: new FormControl('', [Validators.required]),
    });
  }

  onSubmit() {
    if (this.formSchedule.valid) {
      const schedule: ScheduleRequest = {
        title: this.formSchedule.value.title,
        description: this.formSchedule.value.description,
        latitude: this.formSchedule.value.description,
        longitude: this.formSchedule.value.description,
        currencyCode: this.formSchedule.value.currencyCode
      };

      this.scheduleService.create(schedule).subscribe({
        next: (response) => {
          if (response.status === 201) {
            console.log("ok", response.body);
          }
        },
        error: (error) => {
          this.formSchedule.reset()
          this.alertAll = true;

          console.error('Erro ao fazer login', error);
        },
        complete: () => this.formSchedule.reset()
      });
    } else {
      this.alertAll = true;
    }
  }

}
