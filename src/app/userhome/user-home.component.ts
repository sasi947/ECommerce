import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../data'; // Assuming Product is imported from 'data' file
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.css']
})
export class UserHomeComponent {
  // Properties
  searchKeyword: string = ''; // The user's search input
  menuType: string = 'default'; // Not sure how this property is used, might be for toggling some menu options
  filteredProducts: Product[] = []; // Array to store filtered products (if needed, might not be used in the provided code)
  searchResult: undefined | Product[]; // Array to store the search result, it can be `undefined` initially

  // Constructor
  constructor(private router: Router, private productService: ProductService) {}

  // Method to search for products based on user input
  searchProduct(query: KeyboardEvent) {
    if (query) {
      const element = query.target as HTMLInputElement;
      this.searchResult = this.productService.searchProduct(element.value); // Assign the search result directly based on the search input
    }
  }

  // Method to hide the search results when the input loses focus
  hideSearch() {
    this.searchResult = undefined; // Reset the search result to undefined when the search input loses focus
  }

  // Method to redirect to product details page when a product is selected from the search results
  redirectToDetails(id: number) {
    this.router.navigate(['/product-details/' + id]); // Navigate to the product details page with the specified product ID
  }

  // Method to handle the search form submission (not fully implemented)
  submitSearch(val: string) {
    console.warn(val); // Display the value of the search input (for debugging purposes)
    this.router.navigate([`search/:keyword`]); // Navigate to the search results page (route may not be correctly set)
  }

  // Method to handle user logout
  logout(): void {
    // Show a confirmation alert before logging out
    const confirmLogout = window.confirm('Are you sure you want to log out?');
    if (confirmLogout) {
      localStorage.removeItem('user'); // Remove user data from local storage
      this.router.navigate(['/']); // Navigate back to the home page
    }
  }
}
