import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { cart, priceSummary } from '../data-type';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css']
})
export class CartPageComponent implements OnInit {
  cartData: cart[] | undefined;
  priceSummary: priceSummary = {
    price: 0,
    discount: 0,
    tax: 0,
    delivery: 0,
    total: 0
  };

  constructor(private product: ProductService, private router: Router) { }

  ngOnInit(): void {
    this.loadDetails();
  }

  removeToCart(cartId: number | undefined): void {
    if (cartId && this.cartData) {
      this.product.removeToCart(cartId).subscribe(() => {
        this.loadDetails();
      });
    }
  }

  loadDetails(): void {
    this.product.currentCart().subscribe((result: cart[]) => {
      this.cartData = result;
      console.warn(this.cartData);
      let price = 0;
      result.forEach((item: cart) => {
        if (item.quantity) {
          price += +item.price * +item.quantity;
        }
      });
      this.priceSummary.price = price;
      this.priceSummary.discount = price / 10;
      this.priceSummary.tax = price / 10;
      this.priceSummary.delivery = 100;
      this.priceSummary.total = price + (price / 10) + 100 - (price / 10);

      if (!this.cartData.length) {
        this.router.navigate(['/']);
      }
    });
  }

  checkout(): void {
    this.router.navigate(['/checkout']);
  }
}
