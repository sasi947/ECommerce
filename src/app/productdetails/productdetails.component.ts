// Import required modules and services.
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';
import { Product } from '../data';
import { CartService } from '../services/cart.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-productdetails', // Component selector, it can be used in other templates as <app-productdetails></app-productdetails>.
  templateUrl: './productdetails.component.html', // Template file for the component's view.
  styleUrls: ['./productdetails.component.css'] // CSS styles specific to this component.
})
export class ProductdetailsComponent implements OnInit {
  productId: number; // Holds the product ID from the route parameters.
  productDetails: Product | any; // Holds the details of the product being displayed.
  private stockChangeSubscription: Subscription; // Subscription to track stock changes in the ProductService.

  constructor(
    private activeRoute: ActivatedRoute, // Provides access to the current route's parameters.
    private cartService: CartService, // Service for managing the cart.
    private productService: ProductService, // Service for managing product-related operations.
    private router: Router // Service for routing to different components.
  ) { }

  // Lifecycle hook: Executes when the component is initialized.
  ngOnInit() {
    // Load the product details when the component is initialized.
    this.getProductDetails();

    // Subscribe to the stockChanged event from the ProductService to handle real-time stock updates.
    this.stockChangeSubscription = this.productService.stockChanged.subscribe((productId: number) => {
      if (this.productDetails && this.productDetails.id === productId) {
        // If the stock has changed for the displayed product, update the stock in the productDetails.
        const productFromService = this.productService.getProductDetails(productId);
        if (productFromService) {
          this.productDetails.stock = productFromService.stock;
        }
      }
    });
  }

  // Lifecycle hook: Executes when the component is destroyed.
  ngOnDestroy() {
    // Unsubscribe from the stockChanged event to avoid memory leaks.
    this.stockChangeSubscription.unsubscribe();
  }

  // Method to fetch product details based on the product ID from the route parameters.
  getProductDetails() {
    this.activeRoute.params.subscribe(params => {
      this.productId = +params['id'];

      // Load products from local storage using the ProductService.
      const products = JSON.parse(localStorage.getItem('products') || '[]') as Product[];

      // Find the product details based on the productId.
      this.productDetails = products.find(p => p.id === this.productId);
    });
  }

  // Method to add the product to the cart.
  addToCart(quantity: number) {
    if (this.productDetails) {
      // Check if the product can be added to the cart by calling the ProductService's addToCart method.
      const addToCartSuccess = this.productService.addToCart(this.productDetails.id, quantity);

      if (addToCartSuccess) {
        // If the product can be added to the cart, add it to the cart using the CartService.
        this.cartService.addToCart(this.productDetails.id, quantity);

        // Log a success message and show an alert indicating successful addition to the cart.
        console.log('Product added to cart:', this.productDetails);
        alert('Successfully added to cart');

        // Display a success message or notification for adding the product to the cart.
      } else {
        // If the product cannot be added to the cart due to insufficient stock, show an alert.
        alert('Insufficient Stock');
        console.log('Insufficient stock!');
      }
    }
  }

  // Method to navigate to the home page.
  navigateToHome() {
    // Use the router.navigate method to navigate to the home page.
    this.router.navigate(['/header']); // Replace 'header' with the actual route path of your home page.
  }
}
