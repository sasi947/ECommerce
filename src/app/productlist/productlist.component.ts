// Import required modules, services, and data types.
import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service'; // Import ProductService to access product-related operations.
import { Product } from '../data'; // Import the Product data model.
import { Router } from '@angular/router'; // Import Router to handle navigation.

@Component({
  selector: 'app-productlist', // Component selector, it can be used in other templates as <app-productlist></app-productlist>.
  templateUrl: './productlist.component.html', // Template file for the component's view.
  styleUrls: ['./productlist.component.css'] // CSS styles specific to this component.
})
export class ProductlistComponent implements OnInit {
  products: Product[] = []; // Array to hold the list of products.

  constructor(private productService: ProductService, private router: Router) { }

  // Lifecycle hook: Executes when the component is initialized.
  ngOnInit(): void {
    // Load the list of products when the component is initialized.
    this.getProducts();
  }

  // Method to fetch the list of products from the ProductService.
  getProducts(): void {
    // Get all products from the ProductService and assign them to the 'products' array.
    this.products = this.productService.getAllProducts();

    // Check for zero stock products when the component initializes.
    this.checkZeroStockProducts();
  }

  // Private method to handle zero stock products.
  private checkZeroStockProducts(): void {
    // Get the list of zero stock products from the ProductService.
    const zeroStockProducts = this.productService.getZeroStockProducts();

    // Here, you can perform any actions you need for zeroStockProducts
    // without displaying notifications to the user.
    console.log('Zero Stock Products:', zeroStockProducts);
  }
  
  // Method to handle editing a product.
  editProduct(product: Product): void {
    // You can navigate to the edit page passing the product ID as a parameter.
    // Here, we navigate to the '/edit-product' route and pass the product ID as a parameter.
    this.router.navigate(['/edit-product', product.id]);
  }

  // Method to handle deleting a product.
  deleteProduct(productId: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      // If the user confirms the deletion, call the deleteProduct method from the ProductService.
      this.productService.deleteProduct(productId);

      // After deleting, you might want to refresh the product list.
      // Call the getProducts method again to reload the updated product list.
      this.getProducts();
    }
  }
}
