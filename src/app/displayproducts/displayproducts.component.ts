import { Component, OnInit } from '@angular/core';
import { Product } from '../data'; // Assuming Product is a custom data model for products
import { ProductService } from '../services/product.service'; // Assuming ProductService is a service for managing products

@Component({
  selector: 'app-displayproducts',
  templateUrl: './displayproducts.component.html',
  styleUrls: ['./displayproducts.component.css']
})
export class DisplayproductsComponent implements OnInit {
  products: Product[] = []; // Array to store the list of products

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.loadProductsFromLocalStorage(); // Load products from local storage when the component is initialized

    // Subscribe to low stock alerts to update product stock in real-time
    this.productService.getLowStockAlerts().subscribe((lowStockProducts) => {
      // Update the stock of low stock products in the component's products array
      this.products = this.products.map((product) => {
        const matchingLowStockProduct = lowStockProducts.find((lowStockProduct) => lowStockProduct.id === product.id);
        if (matchingLowStockProduct) {
          // Update the stock quantity for the matching product
          return { ...product, stock: matchingLowStockProduct.stock };
        }
        return product; // Return the unchanged product if it's not a low stock product
      });
    });
  }

  // Load products from local storage
  private loadProductsFromLocalStorage() {
    const storedProducts = localStorage.getItem('products'); // Retrieve products from local storage
    if (storedProducts) {
      this.products = JSON.parse(storedProducts); // Parse the stored JSON data and assign it to the component's 'products' array
    }
  }
}
