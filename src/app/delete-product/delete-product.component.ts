import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../services/product.service'; // Assuming ProductService is a service for managing products
import { Product } from '../data'; // Assuming Product is a custom data model for products

@Component({
  selector: 'app-delete-product',
  templateUrl: './delete-product.component.html',
  styleUrls: ['./delete-product.component.css']
})
export class DeleteProductComponent implements OnInit {
  productId!: number; // The ID of the product to be deleted
  productDetails: Product | undefined; // Variable to store the details of the product to be deleted

  constructor(
    private route: ActivatedRoute, // ActivatedRoute is used to access route parameters
    private router: Router, // Router is used for navigation
    private productService: ProductService // ProductService is injected to manage products
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      // Retrieve the 'id' parameter from the URL and convert it to a number
      this.productId = Number(params.get('id'));

      // Get the details of the product with the given productId
      this.productDetails = this.productService.getProductDetails(this.productId);
    });
  }

  // Method to handle the delete action
  onDelete() {
    if (this.productDetails) {
      // If productDetails is available (not undefined), proceed with the delete action
      this.productService.deleteProduct(this.productId); // Call the ProductService to delete the product

      // Optional: Show success message or navigate back to the product list page.
      this.router.navigate(['/product-list']); // Replace '/product-list' with the actual URL of the product list page.
    }
  }

  // Method to handle the cancel action
  onCancel() {
    // Optional: Navigate back to the product details page.
    this.router.navigate(['/product-details', this.productId]); // Replace '/product-details' with the actual URL of the product details page.
  }

}
