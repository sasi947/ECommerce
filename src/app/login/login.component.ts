// Import required modules and services.
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login', // Component selector, it can be used in other templates as <app-login></app-login>.
  templateUrl: './login.component.html', // Template file for the component's view.
  styleUrls: ['./login.component.css'] // CSS styles specific to this component.
})
export class LoginComponent {
  // Declare properties to hold the username and password entered by the user.
  username: string = '';
  password: string = '';

  // Constructor, where dependency injection is used to get instances of AuthService and Router.
  constructor(private authService: AuthService, private router: Router) {}

  // Function triggered when the form is submitted.
  onSubmit(): void {
    console.log("username",this.username);
    console.log("password",this.password);
    // Call the login method of the AuthService and pass the entered username and password.
    // The login method will check if the credentials are valid and return a boolean.
    if (this.authService.login(this.username, this.password)) {
      // If login is successful, handle the redirection based on the user role.
      // Get the user role using the getUserRole() method from the AuthService.
      const userRole = this.authService.getUserRole();
      if (userRole === 'admin') {
        // If the user is an admin, navigate to the '/addProduct' route.
        this.router.navigate(['/addProduct']);
      } else if (userRole === 'user') {
        // If the user is a regular user, navigate to the '/header' route.
        this.router.navigate(['/header']);
      } else {
        // Handle unexpected role (optional) - You can add additional logic here if needed.
      }
    } else {
      // If login fails (invalid credentials), handle the error (optional).
      // You can add logic here to display an error message to the user.
    }
  }
}
