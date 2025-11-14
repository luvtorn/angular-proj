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

  user: any = null

  ngOnInit() {
    this.auth.fetchUser().subscribe({
      next: (res: any) => {
        if (!res.loggedIn) {
          this.router.navigate(['/login']);
          return;
        }

        this.user = { ...this.auth.user$ };

      },
      error: () => {
        this.router.navigate(['/login']);
      }
    });
  }

  logout() {
    this.auth.logout().subscribe();
    this.router.navigate(['/login']);
  }
}
