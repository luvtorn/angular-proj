import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About {
  user = JSON.parse(localStorage.getItem('user') || '"Guest"')

}
