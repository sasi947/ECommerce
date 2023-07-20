import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { cart, order } from '../data-type';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  totalPrice: number | undefined;
  cartData: cart[] | undefined;
  orderMsg: string | undefined;

  constructor(private product: ProductService, private router: Router) {}

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    const userId = user && JSON.parse(user).id;

    if (userId) {
      this.product.currentCart().subscribe((result: cart[]) => {
        let price = 0;
        this.cartData = result;
        result.forEach((item: cart) => {
          if (item.quantity) {
            price += +item.price * +item.quantity;
          }
        });
        this.totalPrice = price + price / 10 + 100 - price / 10;
        console.warn(this.totalPrice);
      });
    }
  }

  orderNow(data: { email: string; address: string; contact: string }): void {
    const user = localStorage.getItem('user');
    const userId = user && JSON.parse(user).id;

    if (this.totalPrice && userId) {
      const orderData: order = {
        ...data,
        totalPrice: this.totalPrice,
        userId,
        id: undefined
      };

      this.cartData?.forEach((item: cart) => {
        setTimeout(() => {
          if (item.id) {
            this.product.deleteCartItems(item.id).subscribe(() => {
              // Handle success or error if needed
            });
          }
        }, 700);
      });

      this.product.orderNow(orderData).subscribe((result) => {
        if (result) {
          this.orderMsg = 'Order has been placed';
          setTimeout(() => {
            this.orderMsg = undefined;
            this.router.navigate(['/my-orders']);
          }, 4000);
        }
      });
    }
  }
}
