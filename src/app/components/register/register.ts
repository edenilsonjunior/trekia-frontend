import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UserService } from '../../services/user-service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {

  formRegister: FormGroup;
  alertAll = false;
  existingUser = false;

  constructor(
    private userService: UserService,
    private router: Router
  ) {
    this.formRegister = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(3)])
    });
  }

  onSubmit(): void {
    if (this.formRegister.valid) {
      this.alertAll = false;
      this.existingUser = false;
      const user = this.formRegister.value;

      this.userService.register(user).subscribe({
        next: (response) => {
          if (response.status === 'CREATED') {
            this.router.navigate(['/login']);
          } 
        },
        error: (error) => {
          if (error.status === 'BAD_REQUEST') {
            this.existingUser = true;
            this.formRegister.reset();
            console.error('Erro ao registrar');
          } else {
            this.alertAll = true;
            this.formRegister.reset();
            console.error('Erro ao registrar', error);
          }
        },
        complete: () => this.formRegister.reset()
      });
    } else {
      this.alertAll = true;
      this.formRegister.markAllAsTouched();
    }
  }

}
