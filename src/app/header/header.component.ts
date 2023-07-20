import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { product } from '../data-type';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  menuType: string = 'default';
  sellerName: string = '';
  userName: string = '';
  searchResult: product[] | undefined;
  cartItems = 0;

  constructor(private router: Router, private productService: ProductService) {}

  ngOnInit(): void {
    this.router.events.subscribe((val: any) => {
      if (val.url) {
        if (localStorage.getItem('seller') && val.url.includes('seller')) {
          const sellerStore = localStorage.getItem('seller');
          const sellerData = sellerStore ? JSON.parse(sellerStore)[0] : null;
          this.sellerName = sellerData ? sellerData.name : '';
          this.menuType = 'seller';
        } else if (localStorage.getItem('user')) {
          const userStore = localStorage.getItem('user');
          const userData = userStore ? JSON.parse(userStore) : null;
          this.userName = userData ? userData.name : '';
          this.menuType = 'user';
          if (userData) {
            this.productService.getCartList(userData.id);
          }
        } else {
          this.menuType = 'default';
        }
      }
    });

    const cartData = localStorage.getItem('localCart');
    if (cartData) {
      this.cartItems = JSON.parse(cartData).length;
    }

    this.productService.cartData.subscribe((items) => {
      this.cartItems = items.length;
    });
  }

  logout(): void {
    localStorage.removeItem('seller');
    this.router.navigate(['/']);
  }

  userLogout(): void {
    localStorage.removeItem('user');
    this.router.navigate(['/user-auth']);
    this.productService.cartData.next([]);
  }

  searchProduct(query: KeyboardEvent): void {
    if (query) {
      const element = query.target as HTMLInputElement;
      this.productService.searchProduct(element.value).subscribe((result) => {
        if (result.length > 5) {
          result.length = 5;
        }
        this.searchResult = result;
      });
    }
  }

  hideSearch(): void {
    this.searchResult = undefined;
  }

  redirectToDetails(id: number): void {
    this.router.navigate(['/details/' + id]);
  }

  submitSearch(val: string): void {
    console.warn(val);
    this.router.navigate([`search/${val}`]);
  }
}
