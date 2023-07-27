import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { Product } from '../data';
import { OptionsService } from '../services/option.service';
import { Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-editproduct',
  templateUrl: './editproduct.component.html',
  styleUrls: ['./editproduct.component.css']
})
export class EditproductComponent implements OnInit, OnDestroy {
  productId!: number;
  productDetails: Product | undefined;

  // Create a new product object to hold the updated values
  updatedProduct: Product = {
    id: 0,
    name: '',
    description: '',
    price: 0,
    images: [],
    categories: [],
    stock: 0,
    color: '',
  };

  selectedCategories = new FormControl(); // For tracking selected categories
  private optionsSubscription: Subscription | undefined;
  categories: string[] = []; // Categories for the product
  selectedImages: File[] = []; // To store selected image files
  productForm: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    public optionsService: OptionsService, // Inject OptionsService and set as public
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.productId = Number(params.get('id'));
      this.productDetails = this.productService.getProductDetails(this.productId);
      if (this.productDetails) {
        this.updatedProduct = { ...this.productDetails }; // Initialize with existing product details
        this.listenForOptionsUpdate();
      } else {
        console.log('Product not found.');
      }
    });

    // Load categories from the service
    this.loadCategoriesFromService();
  }

  onSubmit() {
    // Check if the product details are available
    if (!this.productDetails) {
      alert('Product not found.');
      return;
    }

    // Update the categories of the updated product
    this.updatedProduct.categories = this.selectedCategories.value;

    // Call the productService to edit the product with the updated values
    this.productService.editProduct(this.productId, this.updatedProduct, this.selectedImages);

    // Display a success message and navigate to the product list page after successful edit
    alert('Product edited successfully.');
    this.router.navigate(['/productlist', this.productId]);
  }

  private listenForOptionsUpdate() {
    // Subscribe to optionsService to receive updates when categories are modified
    this.optionsSubscription = this.optionsService.getOptionsSubject().subscribe((categories) => {
      // Reload the categories from the service when they are updated
      this.loadCategoriesFromService();
    });
  }

  removeImage(index: number) {
    // Remove the image at the specified index from the 'images' property of updatedProduct
    this.updatedProduct.images.splice(index, 1);
    alert('Image removed successfully.');
  }

  onImageChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files) {
      // Convert FileList to an array of file objects (selected image files)
      this.selectedImages = Array.from(inputElement.files) as File[];
      alert('Image added successfully.');
    }
  }

  private loadCategoriesFromService() {
    // Retrieve categories from local storage or initialize as empty array
    const storedCategories = localStorage.getItem('categories') || '[]';
    this.categories = JSON.parse(storedCategories);

    // Check if the category is already in the product's categories
    // If yes, add it to selectedCategories
    this.selectedCategories.setValue(this.categories.filter(category => this.updatedProduct.categories.includes(category)));
  }

  ngOnDestroy() {
    this.saveCategoriesToLocalStorage(); // Save the categories to local storage before component destruction

    // Unsubscribe from the optionsSubscription to avoid memory leaks
    if (this.optionsSubscription) {
      this.optionsSubscription.unsubscribe();
      alert('Leaving the page. Categories saved to local storage.');
    }
  }

  private saveCategoriesToLocalStorage() {
    // Save the categories array to local storage as a JSON string
    localStorage.setItem('categories', JSON.stringify(this.categories));
  }

  // Define a getter to access the 'color' form control explicitly
  get colorControl() {
    return this.productForm?.controls['color'];
  }
}
