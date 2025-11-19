import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { BooksService } from '../../services/books.service';
import { PaginationComponent } from '../../components/pagination/pagination';
import { BookModalComponent } from '../../components/bookInfoModal/bookModal';

@Component({
  selector: 'app-dashboard',
  imports: [PaginationComponent, BookModalComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  constructor(
    private auth: AuthService,
    private router: Router,
    private booksService: BooksService,
    private route: ActivatedRoute
  ) {}

  user: any = null;
  books: any = null;

  page = 1;
  booksCount = 0;

  pages: number[] = [];
  visiblePages: number[] = [];

  isModalOpen = false;
  selectedBookId: string = '';

  ngOnInit() {
    this.auth.fetchUser().subscribe({
      next: (res: any) => {
        if (!res.loggedIn) {
          this.router.navigate(['/login']);
          return;
        }
        this.user = this.auth.userValue;
      },
      error: () => this.router.navigate(['/login']),
    });

    this.route.queryParams.subscribe((params) => {
      this.page = +params['page'] || 1;
      this.loadData();
    });
  }

  loadData() {
    this.booksService.fetchBooks(this.page).subscribe((res) => {
      this.books = res.books;
      this.booksCount = res.booksCount;

      const totalPages = Math.ceil(this.booksCount / 10);
      this.pages = Array.from({ length: totalPages }, (_, i) => i + 1);

      this.updateVisiblePages();
    });
  }

  updateVisiblePages() {
    const start = Math.max(1, this.page - 2);
    const end = Math.min(this.pages.length, start + 4);
    this.visiblePages = this.pages.slice(start - 1, end);
  }

  onPageChange(newPage: number) {
    this.page = newPage;
    this.router.navigate(['/dashboard'], { queryParams: { page: this.page } });
    this.loadData();
  }

  openModal(bookId: string) {
    this.isModalOpen = true;
    this.selectedBookId = bookId;
    console.log('Book ID:', bookId);
  }

  closeModal() {
    this.isModalOpen = false;
  }

  logout() {
    this.auth.logout().subscribe();
    this.router.navigate(['/login']);
  }
}
