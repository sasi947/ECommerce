// Import necessary modules and components
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { Product } from '../data';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
  // Define the form group to hold the form controls
  productForm: FormGroup;

  // Define the product object with default values
  newProduct: Product = {
    id: 0,
    name: '',
    description: '',
    price: 0,
    images: [],
    categories: [],
    stock: 0,
    color: ''
  };

  // Create form control for multiple select options
  selectedOptions = new FormControl();

  // Create form control for new category input
  newCategoryInput = new FormControl();

  // Array to store selected images
  selectedImages: File[] = [];

  // Array to store available options (categories)
  options: string[] = [];

  constructor(
    private productService: ProductService,
    private fb: FormBuilder
  ) {
    // Initialize the productForm with form controls and validators
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      color: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit() {
    // Load options (categories) from the local storage on component initialization
    this.loadOptionsFromService();
  }

  onSubmit() {
    // Check if the form is valid before submitting
    if (this.productForm?.valid) {
      // Get the form values and assign them to the newProduct object
      this.newProduct.name = this.productForm.get('name')?.value;
      this.newProduct.description = this.productForm.get('description')?.value;
      this.newProduct.price = this.productForm.get('price')?.value;
      this.newProduct.stock = this.productForm.get('stock')?.value;
      this.newProduct.color = this.productForm.get('color')?.value;
      this.newProduct.categories = this.selectedOptions.value;

      // Call the productService to add the new product
      this.productService.addProduct(this.newProduct, this.selectedImages);
      alert("Product is Added successfully")
      // Reset the form after submitting
      this.resetForm();
    }
    else {
      // Show alert when the form is invalid
      alert("Please fill in the required details.");
    }
  }

  // Method to add a new category to the list of options and selected options
  addNewCategory() {
    const newCategory = this.newCategoryInput.value;
    if (newCategory && !this.options.includes(newCategory)) {
      this.options.push(newCategory);

      // Save updated options in local storage
      localStorage.setItem('categories', JSON.stringify(this.options));

      // Add the new category to the selected options
      this.selectedOptions.setValue([...this.selectedOptions.value, newCategory]);
    }

    // Clear the input field after adding the new category
    this.newCategoryInput.setValue('');
  }

  onImageChange(event: any) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files) {
      // Convert FileList to an array of Files
      this.selectedImages = Array.from(inputElement.files);
    }

  }

  // Method to remove an image from the selected images list
  removeImage(index: number) {
    this.selectedImages.splice(index, 1);
  }

  // Method to convert the File object to Object URL for image preview
  getObjectURL(file: File): string {
    return URL.createObjectURL(file);
  }

  // Method to toggle product categories
  toggleCategory(category: string) {
    const index = this.newProduct.categories.indexOf(category);
    if (index > -1) {
      // Category already exists, remove it from the selected categories
      this.newProduct.categories.splice(index, 1);
    } else {
      // Category doesn't exist, add it to the selected categories
      this.newProduct.categories.push(category);
    }
  }

  // Method to load options (categories) from local storage
  private loadOptionsFromService() {
    const storedCategories = localStorage.getItem('categories');
    if (storedCategories) {
      this.options = JSON.parse(storedCategories);
    }

    // Set the initial selected options based on the stored categories
    this.selectedOptions.setValue(this.options.filter(option => this.newProduct.categories.includes(option)));
  }

  // Method to reset the form after submission
  private resetForm() {
    this.newProduct = {
      id: 0,
      name: '',
      description: '',
      price: 0,
      images: [],
      categories: [],
      stock: 0,
      color: ''
    };

    this.selectedImages = [];
    this.productForm.reset();
  }
}
