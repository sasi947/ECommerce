import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { cart, order, product } from '../data-type';

@Injectable({
  providedIn: 'root',
})
export class ProductService {

  placeOrder(orderData: order) {
    throw new Error('Method not implemented.');
  }
  removeCartItem(cartId: number) {
    throw new Error('Method not implemented.');
  }
  cartData = new BehaviorSubject<product[]>([]);

  constructor(private http: HttpClient) { }
  
  addProduct(data: product) {
    return this.http.post('http://localhost:3000/products', data);
  }
  
  productList() {
    return this.http.get<product[]>('http://localhost:3000/products');
  }

  deleteProduct(id: number) {
    return this.http.delete(`http://localhost:3000/products/${id}`);
  }


  updateProduct(product: product) {
    return this.http.put<product>(
      `http://localhost:3000/products/${product.productId}`,
      product
    );
  }
  
  popularProducts() {
    return this.http.get<product[]>('http://localhost:3000/products?_limit=3');
  }

  trendyProducts() {
    return this.http.get<product[]>('http://localhost:3000/products?_limit=8');
  }

  searchProduct(query: string) {
    return this.http.get<product[]>(
      `http://localhost:3000/products?q=${query}`
    );
  }

  localAddToCart(data: product) {
    let cartData = [];
    let localCart = localStorage.getItem('localCart');
    if (!localCart) {
      localStorage.setItem('localCart', JSON.stringify([data]));
      this.cartData.next([data]);
    } else {
      cartData = JSON.parse(localCart);
      cartData.push(data);
      localStorage.setItem('localCart', JSON.stringify(cartData));
      this.cartData.next(cartData);
    }
  }

  removeItemFromCart(productId: number) {
    let cartData = localStorage.getItem('localCart');
    if (cartData) {
      let items: product[] = JSON.parse(cartData);
      items = items.filter((item: product) => productId !== item.id);
      localStorage.setItem('localCart', JSON.stringify(items));
      this.cartData.next(items);
    }
  }

  addToCart(cartData: cart) {
    return this.http.post('http://localhost:3000/cart', cartData);
  }
  
  getCartList(userId: number) {
    return this.http
      .get<product[]>('http://localhost:3000/cart?userId=' + userId, {
        observe: 'response',
      })
      .subscribe((result) => {
        if (result && result.body) {
          this.cartData.next(result.body);
        }
      });
  }
  
  removeToCart(cartId: number) {
    return this.http.delete('http://localhost:3000/cart/' + cartId);
  }
  
  currentCart() {
    let userStore = localStorage.getItem('user');
    let userData = userStore && JSON.parse(userStore);
    return this.http.get<cart[]>('http://localhost:3000/cart?userId=' + userData.id);
  }

  orderNow(data: order) {
    return this.http.post('http://localhost:3000/orders', data);
  }
  
  orderList() {
    let userStore = localStorage.getItem('user');
    let userData = userStore && JSON.parse(userStore);
    return this.http.get<order[]>('http://localhost:3000/orders?userId=' + userData.id);
  }

  deleteCartItems(cartId: number) {
    return this.http.delete('http://localhost:3000/cart/' + cartId);
  }

  cancelOrder(orderId: number) {
    return this.http.delete('http://localhost:3000/orders/' + orderId);
  }
}
