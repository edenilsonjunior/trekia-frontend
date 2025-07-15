import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user-service';

@Component({
  selector: 'app-login',
  imports: [RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {

  formLogin: FormGroup;
  alertAll =  false;

  constructor (
    private userService: UserService,
    private router: Router
  ) {
    this.formLogin = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(3)])
    });
  }

  onSubmit(): void {
    if (this.formLogin.valid) {
      this.alertAll = false;
      const user = this.formLogin.value;
  
      this.userService.login(user).subscribe({
        next: (response) => {
          const token = response.data;
          localStorage.setItem('authToken', token);

          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.formLogin.reset()
          this.alertAll = true;

          console.error('Erro ao fazer login', error);
        },
        complete: () => this.formLogin.reset()
      });
    } else {
      this.alertAll = true;
      this.formLogin.markAllAsTouched();
    }
  }

}
