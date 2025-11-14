import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email = '';
  password = '';
  message = '';
  isLoggedIn = false;
  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.auth.fetchUser().subscribe({
      next: (res: any) => {
        console.log(res);
        if (res.loggedIn) {
          this.router.navigate(['/dashboard']);
          this.isLoggedIn = true;
        } else {
          this.isLoggedIn = false;
        }
      },
    });
  }

  login() {
    if (!this.email || !this.password) {
      this.message = 'Wszystkie pola są wymagane';
      return;
    }

    const data = {
      email: this.email,
      password: this.password,
    };

    this.auth.login(data).subscribe({
      next: (response) => {
        this.message = 'Logowanie zakończone sukcesem!';
        this.router.navigate(['/dashboard']);
        this.isLoggedIn = true;
      },
      error: (error) => {
        console.error('Błąd logowania', error);
        this.message = 'Błąd logowania: ' + (error.error?.message || error.message || 'Nieznany błąd');
      },
    });


  }
}
