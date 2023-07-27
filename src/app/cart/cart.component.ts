import { Component, OnInit } from '@angular/core';
import { Product } from '../data'; // Assuming Product is a custom data model
import { cart } from '../data'; // Assuming cart is a custom data model
import { CartService } from '../services/cart.service'; // Assuming CartService is a service for managing the cart

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: cart[] = []; // An array to store the cart items

  constructor(private cartService: CartService) {
    this.cartItems = cartService.getCartItems(); // Initialize cartItems by getting cart items from the CartService
  }

  ngOnInit() {
    // The ngOnInit lifecycle hook. You can perform any initialization logic here if needed.
  }

  // Method to clear the cart
  clearCart() {
    this.cartService.clearCart(); // Clear the cart items in the CartService
    this.cartItems = []; // Clear the local cartItems array as well
  }

  // Method to remove an item from the cart based on its index
  removeFromCart(cartItemIndex: number) {
    this.cartService.removeFromCart(cartItemIndex); // Remove the item from the cart in the CartService
    this.cartItems = this.cartService.getCartItems(); // Refresh cartItems after removal from the CartService
  }

  // Method to calculate the total price of all items in the cart
  getTotalPrice(): number {
    return this.cartService.calculateTotalPrice(); // Calculate the total price using the CartService
  }

  // Method to proceed with the checkout process
  checkout() {
    // Display an alert to ask the user if they would like to proceed
    const isProceed = window.confirm('Would you like to proceed with the checkout?');

    // If the user clicks "OK," redirect to the checkout page
    if (isProceed) {
      // Replace 'your-checkout-page' with the actual URL of your checkout page
      window.location.href = '/checkout';
    }
  }

  // Method to update the quantity of an item in the cart
  updateQuantity(cartItemIndex: number, quantity: number) {
    if (quantity >= 0) {
      this.cartItems[cartItemIndex].quantity = quantity; // Update the quantity of the item in the local cartItems array
      this.cartService.updateCartItems(this.cartItems); // Update the cart items in the CartService with the updated quantity
    }
  }

}
