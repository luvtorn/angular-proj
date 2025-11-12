import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {

  constructor(private auth: AuthService, private router: Router) {}

  user = JSON.parse(localStorage.getItem('user') || '"Guest"')

  ngOnInit() {
    const isAuth = !!localStorage.getItem('user');

    if (!isAuth) {
      this.router.navigate(['/login']);
    }
  }

  logout() {
    this.auth.logout().subscribe();
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}
