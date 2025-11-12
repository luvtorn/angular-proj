import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  standalone: true,
  templateUrl: './app.html',
})
export class App {
  isLoggedIn = !!localStorage.getItem('user');

  ngDoCheck() {
    this.isLoggedIn = !!localStorage.getItem('user');
  }
}