// Import required modules and data types.
import { Injectable } from '@angular/core';
import { Product, cart } from '../data';
import { ProductService } from './product.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  // Private properties for managing cart items.
  private readonly localStorageKey = 'cartItems';
  private cartItems: cart[] = [];
  private cartItemsKey = 'cartItems';

  // Constructor: Inject the ProductService and fetch cart items from local storage.
  constructor(private productService: ProductService) {
    this.fetchCartItemsFromLocalStorage();
  }

  // Method to fetch cart items from local storage.
  private fetchCartItemsFromLocalStorage() {
    const savedCartItems = localStorage.getItem(this.localStorageKey);
    if (savedCartItems) {
      this.cartItems = JSON.parse(savedCartItems) as cart[];
    }
  }

  // Method to save cart items to local storage.
  saveCartItemsToLocalStorage(cartItems: any[]) {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }

  // Method to get cart items from local storage.
  getCartItemsFromLocalStorage(): any[] {
    return JSON.parse(localStorage.getItem('cartItems') || '[]');
  }

  // Method to add a product to the cart.
  addToCart(productId: number, quantity: number) {
    const product = this.productService.getProductDetails(productId);

    if (!product) {
      // Product not found, handle error or show notification
      return;
    }

    // Check if the product is already in the cart
    const existingItem = this.cartItems.find((item) => item.id === productId);

    if (existingItem) {
      // If the product is already in the cart, update the quantity
      existingItem.quantity += quantity;
    } else {
      // If the product is not in the cart, add it as a new item
      this.cartItems.push({
        id: product.id,
        name: product.name,
        price: product.price,
        category: product.categories[0], // Assuming there's only one category in the categories array
        color: product.color,
        image: product.images[0], // Assuming there's only one image in the images array
        description: product.description,
        quantity: quantity,
        productId: productId, // Storing the productId separately for reference
        userId: 0 // Assuming there's a user ID for tracking purposes, set to 0 for now
      });
    }

    // Save the updated cart items to local storage
    this.saveCartItemsToLocalStorage(this.cartItems);
  }

  // Method to get the cart items.
  getCartItems(): cart[] {
    return JSON.parse(localStorage.getItem('cartItems') || '[]');
  }

  // Method to update the cart items.
  updateCartItems(cartItems: cart[]): void {
    this.cartItems = cartItems;
    // Save the updated cart items to local storage
    this.saveCartItemsToLocalStorage(this.cartItems);
  }

  // Method to clear the cart.
  clearCart() {
    this.cartItems = [];
    // Save the cleared cart items to local storage
    this.saveCartItemsToLocalStorage(this.cartItems);
  }

  // Method to remove a product from the cart.
  removeFromCart(cartItemIndex: number) {
    this.cartItems.splice(cartItemIndex, 1);
    // Save the updated cart items to local storage
    this.saveCartItemsToLocalStorage(this.cartItems);
  }

  // Method to calculate the discount price for a cart item.
  calculateDiscountPrice(cartItem: cart): number {
    // Calculate discount based on some conditions (example: 10% discount if quantity >= 5)
    const discountPercentage = cartItem.quantity >= 2 ? 10 : 0; // 10% discount if quantity >= 5, otherwise 0
    const discountAmount = (discountPercentage / 100) * cartItem.price * cartItem.quantity;
    return discountAmount;
  }

  // Method to calculate the net price for a cart item after applying any discounts or promotions.
  calculateNetPrice(cartItem: cart): number {
    // Calculate net price after applying any discounts or promotions
    // For this example, let's assume there's a 5% tax applied to each item
    const taxPercentage = 5;
    const taxAmount = (taxPercentage / 100) * cartItem.price * cartItem.quantity;
    return taxAmount;
  }

  // Method to calculate the total price of all items in the cart after applying discounts and taxes.
  calculateTotalPrice(): number {
    return this.cartItems.reduce((total, item) => total + (this.calculateNetPrice(item) + item.price * item.quantity - this.calculateDiscountPrice(item)), 0);
  }
}
