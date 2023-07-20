import { Component, OnInit } from '@angular/core';
import { order } from '../data-type';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnInit {

  orderData: order[] | undefined;
  
  constructor(private product: ProductService) { }

  ngOnInit(): void {
    this.getOrderList();
  }
  
  cancelOrder(orderId: number | undefined): void {
    if (orderId) {
      this.product.cancelOrder(orderId).subscribe((result) => {
        if (result) {
          this.getOrderList();
        }
      });
    }
  }
  
  getOrderList(): void {
    this.product.orderList().subscribe((result) => {
      this.orderData = result;
    });
  }
}
