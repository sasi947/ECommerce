import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { cart, product } from '../data-type';
import { ProductService } from '../services/product.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  public productData: any;
  public productId: number | undefined;
  public productDetails: product | undefined;
  removeCart: boolean | undefined;
  productQuantity: number = 1;
  cartData: any;

  public constructor(
    private activeRoute: ActivatedRoute,
    private product: ProductService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const url: string = '/assets/db.json';
    this.http.get(url).subscribe((response) => {
      this.productData = response;
      this.getProductDetails();
    });
  }

  getProductDetails(): void {
    this.activeRoute.params.subscribe(params => {
      this.productId = +params['id'];
      const productDetails = this.productData.products.find((p: { id: number | undefined; }) => p.id === this.productId);
      this.productDetails = productDetails;
    });
  }

  updateCartStatus(productId: number): void {
    const cartData = localStorage.getItem('localCart');
    if (cartData) {
      const items = JSON.parse(cartData) as product[];
      const item = items.find((item) => item.id === productId);
      this.removeCart = !!item;
    } else {
      this.removeCart = false;
    }
  }
  handleQuantity(val: string): void {
    if (this.productQuantity < 20 && val === 'plus') {
      this.productQuantity += 1;
    } else if (this.productQuantity > 1 && val === 'min') {
      this.productQuantity -= 1;
    }
  }
  addToCart(): void {
    if (this.productDetails) {
      this.productDetails.quantity = this.productQuantity;
      if (!localStorage.getItem('user')) {
        // If there is no logged-in user, add the product to the local cart.
        const cartData = localStorage.getItem('localCart');
        let cartItems: product[] = [];
        if (cartData) {
          cartItems = JSON.parse(cartData) as product[];
        }
        cartItems.push(this.productDetails);
        localStorage.setItem('localCart', JSON.stringify(cartItems));
        this.removeCart = true;
      } else {
        // If there is a logged-in user, add the product to the server cart.
        const userId = JSON.parse(localStorage.getItem('user')!).id;
        const cartData: cart = {
          ...this.productDetails,
          productId: this.productDetails.id,
          userId
        };
        delete cartData.id;
  
        this.product.addToCart(cartData).subscribe({
          next: () => {
            this.product.getCartList(userId);
            this.removeCart = true;
          },
          error: (error) => {
            console.error('Error adding to cart:', error);
          },
        });
      }
    }
  }
  removeFromCart(productId: number): void {
    if (!localStorage.getItem('user')) {
      // If there is no logged-in user, remove the product from the local cart.
      const cartData = localStorage.getItem('localCart');
      if (cartData) {
        const cartItems: product[] = JSON.parse(cartData);
        const updatedCartItems = cartItems.filter((item) => item.id !== productId);
        localStorage.setItem('localCart', JSON.stringify(updatedCartItems));
        this.removeCart = false;
      }
    } else {
      // If there is a logged-in user, remove the product from the server cart.
      if (this.cartData) {
        this.product.removeToCart(this.cartData.id).subscribe({
          next: () => {
            const userId = JSON.parse(localStorage.getItem('user')!).id;
            this.product.getCartList(userId);
          },
          error: (error) => {
            console.error('Error removing from cart:', error);
          },
        });
      }
    }
  }
  
  
  
}
