import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
  standalone: true
})
export class Register {
  email = ''; password = ''; confirmPassword = ''; firstName = ''; lastName = ''; message = '';
  phoneNumber = '';
  description = '';
  classLevel = '';
  constructor(private auth: AuthService, private router: Router) { }

  register() {
    if (this.password !== this.confirmPassword) {
      this.message = 'Hasła nie są zgodne';
      return;
    }

    if (!this.email || !this.password || !this.firstName || !this.lastName) {
      this.message = 'Wszystkie pola są wymagane';
      return;
    }

    if(this.password.length < 6) {
      this.message = 'Hasło musi mieć co najmniej 6 znaków';
      return;
    }

    const data = {
      email: this.email,
      password: this.password,
      firstName: this.firstName,
      lastName: this.lastName,
      phoneNumber: this.phoneNumber,
      description: this.description,
      classLevel: this.classLevel
    };

    this.auth.register(data).subscribe({
      next: (response) => {
        this.message = 'Rejestracja zakończona sukcesem! Możesz się teraz zalogować.';
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Błąd rejestracji', error);
        this.message = 'Błąd rejestracji: ' + (error.error?.message || error.message || 'Nieznany błąd');
      }
    });
  }
}
