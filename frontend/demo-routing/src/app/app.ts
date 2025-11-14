import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  standalone: true,
  templateUrl: './app.html',
})
export class App {
  isLoggedIn = false;
  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.auth.user$.subscribe((user) => {
      this.isLoggedIn = !!user;
    });

    this.auth.fetchUser().subscribe();
  }
}
