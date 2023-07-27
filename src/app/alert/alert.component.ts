// Import required modules and services
import { Component } from '@angular/core';
import { Product } from '../data'; // Assuming Product is a custom data model
import { ProductService } from '../services/product.service'; // Assuming ProductService is a service for managing products
import { Router } from '@angular/router';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent {
  products: Product[] = []; // An array to store the products

  // Constructor to inject required services
  constructor(private productService: ProductService, private router: Router) { }

  // Lifecycle hook, runs when the component is initialized
  ngOnInit(): void {
    this.getProducts(); // Fetch the products when the component initializes
  }

  // Method to get all products from the ProductService
  getProducts(): void {
    this.products = this.productService.getAllProducts();
    
    // Check for zero stock products when the component initializes
    this.checkZeroStockProducts();
  }

  // Method to check for zero stock products
  private checkZeroStockProducts(): void {
    const zeroStockProducts = this.productService.getZeroStockProducts();
    // Here, you can perform any actions you need for zeroStockProducts
    // without displaying notifications to the user.
    console.log('Zero Stock Products:', zeroStockProducts);
    alert("Restock the products"); // Display an alert notifying the need to restock the products
  }

}
