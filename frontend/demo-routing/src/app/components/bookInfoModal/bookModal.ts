import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { BooksService } from '../../services/books.service';

@Component({
  selector: 'app-bookModal',
  templateUrl: './bookModal.html',
  imports: [FormsModule],
  standalone: true,
})
export class BookModalComponent {
  @Input() isModalOpen = false;
  @Output() open = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();
  @Input() bookId: string = '';

  book: any = null;

  constructor(private booksService: BooksService, private router: Router) {}

  onClose() {
    this.close.emit();
  }
  reloadCurrentRoute() {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  ngOnChanges() {
    this.onLoad();
  }

  onLoad() {
    this.booksService.fetchBookById(this.bookId).subscribe({
      next: (response) => {
        this.book = response.book;
        console.log('Book info loaded successfully', response);
      },
      error: (error) => {
        console.error('Error loading book info', error);
      },
    });
  }
}
