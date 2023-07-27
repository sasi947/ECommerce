import { Injectable, EventEmitter } from '@angular/core';
import { Product } from '../data';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductService {
  // Properties
  private readonly localStorageKey = 'products';
  private products: Product[] = []; // Array to hold the list of products
  private inventoryThreshold = 10; // Threshold for low stock alerts
  private lowStockAlertSubject = new BehaviorSubject<Product[]>([]); // BehaviorSubject to emit low stock alerts
  private zeroStockProducts: Product[] = []; // Array to store products with zero stock
  stockChanged: EventEmitter<number> = new EventEmitter<number>(); // EventEmitter to emit stock changes for subscribers

  // Constructor
  constructor() {
    this.fetchProductsFromLocalStorage(); // Fetch products from Local Storage during initialization
  }

  // Method to fetch products from Local Storage during initialization
  private fetchProductsFromLocalStorage() {
    const savedProducts = localStorage.getItem(this.localStorageKey);
    if (savedProducts) {
      try {
        this.products = JSON.parse(savedProducts) as Product[]; // Parse the saved products from Local Storage
        // Iterate through each product to ensure 'categories' is an array of strings
        this.products.forEach((product) => {
          product.categories = product.categories as string[] || []; // Handle the case where categories are initially undefined

          // Explicitly set the type of product.categories to 'string[]'
          if (!Array.isArray(product.categories)) {
            product.categories = [];
          } else {
            product.categories = product.categories.map((category) => typeof category === 'string' ? category.trim() : '');
          }
        });
        this.checkAndAlertLowStock(); // Check and alert low stock products after fetching from Local Storage
      } catch (error) {
        console.error('Error parsing saved products:', error);
      }
    }
  }

  // Method to add a new product to the catalog
  addProduct(product: Product, imageFiles: File[]) {
    const newProductId = this.generateUniqueId(); // Generate a unique ID for the new product
    product.id = newProductId;

    // Convert the image files to Base64 strings
    const imageBase64Strings: string[] = [];
    const reader = new FileReader();

    const loadImage = (file: File) => {
      reader.onload = () => {
        const base64String: string | ArrayBuffer | null = reader.result as string;
        if (base64String) {
          imageBase64Strings.push(base64String);
          if (imageBase64Strings.length === imageFiles.length) {
            // All images have been converted, add them to the product and save to Local Storage
            product.images = imageBase64Strings;
            this.products.push(product);
            this.saveToLocalStorage(); // Save the updated products array to Local Storage
            this.checkAndAlertLowStock(); // Check and alert low stock products after adding a new product
          }
        }
      };
      reader.readAsDataURL(file);
    };

    // Load each image file and convert to Base64 string
    imageFiles.forEach((file) => loadImage(file));
  }

  // Method to search for products based on a query string
  searchProduct(query: string): Product[] {
    query = query.toLowerCase(); // Convert the query to lowercase for case-insensitive search
    return this.products.filter((product) => {
      // Perform a simple case-insensitive search on product names or other relevant properties
      return (
        product.name.toLowerCase().includes(query) ||
        product.color.toLowerCase().includes(query) ||
        product.categories.some((category) => category.toLowerCase().includes(query))
      );
    });
  }

  // Method to get product details by product ID
  getProductDetails(productId: number): Product | undefined {
    return this.products.find((product) => product.id === productId);
  }

  // Method to get all products in the catalog
  getAllProducts(): Product[] {
    return this.products;
  }

  // Method to edit a product in the catalog
  editProduct(productId: number, updatedProduct: Product, imageFiles: File[]) {
    // Find the index of the product in the products array
    const productIndex = this.products.findIndex((product) => product.id === productId);

    // If the product is found, update its details
    if (productIndex !== -1) {
      // Update the product details
      this.products[productIndex] = { ...this.products[productIndex], ...updatedProduct };

      // Check if there are new image files to update
      if (imageFiles.length > 0) {
        const imageBase64Strings: string[] = [];
        let imagesProcessed = 0;

        const loadImage = (file: File) => {
          const reader = new FileReader();
          reader.onload = () => {
            const base64String: string | ArrayBuffer | null = reader.result as string;
            if (base64String) {
              imageBase64Strings.push(base64String);
              imagesProcessed++;

              if (imagesProcessed === imageFiles.length) {
                // All new images have been converted, update the product's image array
                this.products[productIndex].images = imageBase64Strings;
                this.saveToLocalStorage();
                this.checkAndAlertLowStock(); // Check and alert low stock products after updating the product
              }
            }
          };
          reader.readAsDataURL(file);
        };

        // Load new images for the product
        imageFiles.forEach(loadImage);
      } else {
        // If there are no new image files to update, simply save the updated product to Local Storage
        this.saveToLocalStorage();
        this.checkAndAlertLowStock(); // Check and alert low stock products after updating the product
      }
    }
  }

  // Method to delete a product from the product catalog
  deleteProduct(productId: number) {
    // Filter out the product with the specified ID from the products array
    this.products = this.products.filter((product) => product.id !== productId);

    // Save the updated products array to Local Storage
    this.saveToLocalStorage();
  }

  // Helper method to retrieve cart items from Local Storage
  private getCartItemsFromLocalStorage(): { productId: number; quantity: number }[] {
    return JSON.parse(localStorage.getItem('cartItems') || '[]') as { productId: number; quantity: number }[];
  }

  // Helper method to generate a unique ID for a new product
  private generateUniqueId(): number {
    let maxId = 100;
    this.products.forEach((product) => {
      if (product.id > maxId) {
        maxId = product.id;
      }
    });
    return maxId + 1;
  }

  // Helper method to save the products array to Local Storage
  private saveToLocalStorage() {
    localStorage.setItem('products', JSON.stringify(this.products));
  }

  // Method to check and alert when stock reaches the minimum threshold or zero
  private checkAndAlertLowStock(product?: Product) {
    if (!product || product.stock <= this.inventoryThreshold) {
      // Filter products with low stock (stock <= inventoryThreshold)
      const lowStockProducts = this.products.filter((p) => p.stock <= this.inventoryThreshold);

      // Check for products with zero stock
      const zeroStockProducts = this.products.filter((p) => p.stock === 0);

      // Emit the low stock products through the BehaviorSubject
      this.lowStockAlertSubject.next(lowStockProducts);

      // If there are products with zero stock, add them to the zeroStockProducts array
      if (zeroStockProducts.length > 0) {
        this.zeroStockProducts.push(...zeroStockProducts);
        // Here, you can perform any additional actions or trigger notifications for the admin, without showing them to the user.
        // For example, you can log the zeroStockProducts or send an alert to the admin.
      }
    }
  }

  // Method to get a product by its ID
  getProductById(productId: number): Product | undefined {
    return this.products.find((product) => product.id === productId);
  }

  // Method to get products with zero stock
  getZeroStockProducts(): Product[] {
    return this.zeroStockProducts;
  }

  // Method to subscribe to low stock alerts
  getLowStockAlerts() {
    return this.lowStockAlertSubject.asObservable();
  }

  // Method to get data for the current user (mock implementation)
  getDataForCurrentUser(): Product[] {
    // Your implementation to get the data for the current user
    // For example, you can retrieve data from a backend API or local storage
    return JSON.parse(localStorage.getItem('products') || '[]');
  }

  // Method to update the stock quantity of a product
  updateProductQuantity(productId: number, newQuantity: number) {
    // Find the product in the inventory and update its quantity
    const product = this.products.find((p) => p.id === productId);
    if (product) {
      product.stock = newQuantity;
    }
  }

  // Method to handle product inventory and adding products to the cart
  addToCart(productId: number, quantity: number) {
    // Find the product with the specified ID from the products array
    const product = this.products.find((product) => product.id === productId);

    // If the product is found and has sufficient stock
    if (product && product.stock >= quantity) {
      // Reduce the stock of the product
      product.stock -= quantity;

      if (product.stock === 0) {
        // Check and alert low stock (including zero stock) products
        this.checkAndAlertLowStock(product);
      }

      // Save the updated products array to Local Storage
      this.saveToLocalStorage();
      this.stockChanged.emit(productId); // Emit the stock change event to subscribers
      return true;
    } else {
      // Return false to indicate insufficient stock
      return false;
    }
  }
}

export { Product };
