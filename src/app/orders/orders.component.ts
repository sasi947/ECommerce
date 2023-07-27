import { Component,OnInit } from '@angular/core';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit{
  orders: any[];

  constructor() { }

  ngOnInit() {
    // Retrieve the orders from local storage and store them in the orders array
    this.orders = JSON.parse(localStorage.getItem('orders') || '[]');
}}
