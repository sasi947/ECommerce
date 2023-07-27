import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title(title: any) {
    throw new Error('Method not implemented.');
  }
  userRole: string;

  constructor(private authService: AuthService, private router: Router) {
    // Get the user role from the AuthService when the AppComponent is initialized
    const role = this.authService.getUserRole();

    // Set the 'userRole' property based on the user role retrieved from AuthService
    // If the user role is null (user not logged in), set the role to 'guest' or any other default role if needed
    this.userRole = role !== null ? role : 'guest';
  }

  // Function to handle user logout
  logout(): void {
    // Show a confirmation alert before logging out
    const confirmLogout = window.confirm('Are you sure you want to log out?');
    if (confirmLogout) {
      // Clear the current user's data from local storage
      localStorage.removeItem('seller');

      // Navigate back to the default route (or any other desired route)
      this.router.navigate(['/']);
    }
  }
}
