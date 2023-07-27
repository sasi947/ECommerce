// Import required modules and services.
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-seller-home', // Component selector, it can be used in other templates as <app-seller-home></app-seller-home>.
  templateUrl: './seller-home.component.html', // Template file for the component's view.
  styleUrls: ['./seller-home.component.css'] // CSS styles specific to this component.
})
export class SellerHomeComponent {
  constructor(private router: Router) {} // Inject the Router in the constructor.

  // Method to handle the logout functionality.
  logout(): void {
    // Show a confirmation alert before logging out.
    const confirmLogout = window.confirm('Are you sure you want to log out?');

    // If the user confirms the logout, proceed with the logout process.
    if (confirmLogout) {
      // Remove the seller data from the local storage to log the seller out.
      localStorage.removeItem('seller');

      // Navigate the user to the home page ('/') after successful logout.
      this.router.navigate(['/']);
    }
  }
}
