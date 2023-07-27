import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // Get the role of the current user from the AuthService
    const userRole = this.authService.getUserRole();

    // Example: Restrict routes based on user role
    if (route.data['roles'] && !route.data['roles'].includes(userRole)) {
      // If the route requires specific roles and the current user's role is not allowed, navigate to the appropriate home page
      if (userRole === 'admin') {
        this.router.navigate(['/admin-home']);
      } else if (userRole === 'user') {
        this.router.navigate(['/user-home']);
      } else {
        // Handle unexpected role (optional): In this example, if the user's role is neither 'admin' nor 'user', navigate to the default home page
        this.router.navigate(['/']);
      }
      return false; // Prevent navigation to the protected route
    }

    return true; // Allow navigation to the protected route
  }
}
