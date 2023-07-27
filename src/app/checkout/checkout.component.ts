import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service'; // Assuming CartService is a service for managing the cart
import { ProductService } from '../services/product.service'; // Assuming ProductService is a service for managing products
import { Product, cart } from '../data'; // Assuming Product and cart are custom data models
import { Router } from '@angular/router'; // Importing Router for navigation

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  cartItems: cart[]; // An array to store the cart items
  shippingDetails = {
    name: '',
    mobile: '',
    Email: '',
    address: '',
  };
  paymentDetails = {
    paymentMode: 'Cash On Delivery'
  };
  total: number = 0; // Variable to store the total price of all cart items

  constructor(
    private cartService: CartService,
    private router: Router,
    private productService: ProductService
  ) { }

  ngOnInit() {
    this.cartItems = this.cartService.getCartItems(); // Get cart items from the CartService and initialize the cartItems array
    this.calculateTotal(); // Calculate the total price of all cart items
  }

  // Method to calculate the total price of all cart items
  calculateTotal() {
    this.total = this.cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  }

  // Method to generate a unique order ID
  generateUniqueId(): string {
    const timestamp = new Date().getTime().toString();
    const randomNum = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    return timestamp + randomNum;
  }

  // Method to clear the cart and update the total price
  onClearCart() {
    this.cartService.clearCart(); // Clear the cart items in the CartService
    this.cartItems = []; // Clear the local cartItems array as well
    this.calculateTotal(); // Update the total price after clearing the cart
  }

  // Method to handle form submission
  onSubmitForm() {
    // Check if required fields are filled
    if (!this.shippingDetails.name || !this.shippingDetails.mobile || !this.shippingDetails.Email || !this.shippingDetails.address) {
      alert('Please fill all the shipping details.');
      return;
    }

    // Create the order object
    const order = {
      id: this.generateUniqueId(), // Generate a unique ID for the order
      cartItems: this.cartItems,
      total: this.total,
      shippingDetails: this.shippingDetails,
      paymentDetails: this.paymentDetails
    };

    // Update product quantities and save the order to local storage
    const orders = JSON.parse(localStorage.getItem('orders') || '[]'); // Retrieve existing orders or initialize as an empty array
    this.cartItems.forEach((cartItem) => {
      const productId = cartItem.productId;
      const orderedQuantity = cartItem.quantity;
      const product = this.productService.getProductById(productId);

      if (product) {
        const remainingQuantity = product.stock - orderedQuantity;
        if (remainingQuantity >= 0) {
          // Decrease the product quantity
          this.productService.updateProductQuantity(productId, remainingQuantity);
        } else {
          // Handle insufficient stock scenario (optional)
          // For example, show a message to the user indicating that the product is out of stock or adjust the order accordingly.
        }
      }
    });

    orders.push(order); // Add the new order to the list of orders
    localStorage.setItem('orders', JSON.stringify(orders)); // Save the updated orders to local storage

    // Clear the cart and update the UI
    this.cartService.clearCart(); // Clear the cart items in the CartService
    this.cartItems = []; // Clear the local cartItems array as well
    this.calculateTotal(); // Update the total price after clearing the cart

    // Reset shipping and payment details after successful submission (optional)
    this.shippingDetails = {
      name: '',
      mobile: '',
      Email: '',
      address: '',
    };
    this.paymentDetails = {
      paymentMode: 'Cash On Delivery'
    };

    // Show a success alert and navigate back to the header page after successful submission
    alert('Order placed successfully!');
    this.router.navigate(['/header']); // Replace '/header' with the actual URL of your header page
  }
}
