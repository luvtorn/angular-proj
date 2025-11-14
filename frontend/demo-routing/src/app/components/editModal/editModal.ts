import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modal',
  templateUrl: './editModal.component.html',
  imports: [FormsModule],
  standalone: true,
})
export class EditModalComponent {
  @Input() isModalOpen = false;
  @Input() user: any = null;
  @Output() open = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  constructor(private auth: AuthService, private router: Router) {}

  formData = {
    firstName: '',
    classLevel: '',
    email: '',
    phoneNumber: '',
    description: '',
  };

  onClose() {
    this.close.emit();
  }
  reloadCurrentRoute() {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  saveChanges() {
    console.log('Saved data:', this.formData);
    console.log('User data wsa:', this.user);
    this.auth.editProfile(this.formData, this.user._id).subscribe({
      next: (response) => {
        this.user = response.user;
        this.reloadCurrentRoute();
        console.log('Profile updated successfully', response);
      },
      error: (error) => {
        console.error('Error updating profile', error);
      },
    });

    this.onClose();
  }
}
