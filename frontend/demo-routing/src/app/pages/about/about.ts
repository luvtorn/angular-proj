import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { EditModalComponent } from '../../components/editModal/editModal';

@Component({
  selector: 'app-about',
  imports: [EditModalComponent],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About {
  user: any = null;
  isLoggedIn: boolean = false;
  isModalOpen: boolean = false;

  constructor(private auth: AuthService, private router: Router) {}

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  ngOnInit() {
    this.auth.user$.subscribe((user) => {
      if (user) {
        this.isLoggedIn = true;
        this.user = user;
        console.log('User data:', this.user);
      } else {
        this.router.navigate(['/about']);
        this.isLoggedIn = false;
      }
    });
    this.auth.fetchUser().subscribe();
  }
}
