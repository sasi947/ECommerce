import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  isAdmin: boolean = false; // Set this based on the user's role after login

  // Assuming you have a FormControl for the search input
  control: FormControl = new FormControl();

  // Assuming you have an Observable of filtered streets for the autocomplete
  filteredStreets: Observable<string[]>;

  constructor(private router: Router) { }

  logout() {
    // Implement your logout logic here
    // For example, navigate to the login page after logout
    this.router.navigate(['/']);
  }
}
