import { Injectable } from '@angular/core';

// Interface to define the structure of user data
interface UserData {
  password: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Dummy user data for demonstration purposes
  private users: { [username: string]: UserData } = {
    admin: { password: 'adminpass', role: 'admin' },
    user: { password: 'userpass', role: 'user' }
  };

  // Key for storing the current user data in local storage
  private readonly USER_KEY = 'current_user';

  // Function to handle user login
  login(username: string, password: string): boolean {
    // Check if the provided username exists in the users object and if the password matches
    if (this.users[username] && this.users[username].password === password) {
      // Save the current user's data to local storage
      localStorage.setItem(this.USER_KEY, JSON.stringify({ username, role: this.users[username].role }));
      return true; // Login successful
    }
    return false; // Login failed
  }

  // Function to handle user logout
  logout(): void {
    // Remove the current user's data from local storage
    localStorage.removeItem(this.USER_KEY);
  }

  // Function to get the username of the current user
  getCurrentUser(): string | null {
    // Retrieve the current user's data from local storage
    const userData = localStorage.getItem(this.USER_KEY);
    // If the user data exists in local storage, parse it and return the username, otherwise return null
    return userData ? JSON.parse(userData).username : null;
  }

  // Function to get the role of the current user
  getUserRole(): string | null {
    // Retrieve the current user's role from local storage
    const userData = localStorage.getItem(this.USER_KEY);
    // If the user data exists in local storage, parse it and return the role, otherwise return null
    return userData ? JSON.parse(userData).role : null;
  }
}
