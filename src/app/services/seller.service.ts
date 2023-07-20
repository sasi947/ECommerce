import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { login, signUp } from '../data-type';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SellerService {
  private isSellerLoggedIn = new BehaviorSubject<boolean>(false);
  isSellerLoggedIn$ = this.isSellerLoggedIn.asObservable();
  public isLoginError = new BehaviorSubject<boolean>(false);
  isLoginError$ = this.isLoginError.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  userSignUp(data: signUp): void {
    this.http.post('http://localhost:3000/seller', data, { observe: 'response' })
      .subscribe((result: any) => {
        console.warn(result);
        if (result && result.body) {
          localStorage.setItem('seller', JSON.stringify(result.body));
          this.router.navigate(['seller-home']);
        }
      });
  }

  reloadSeller(): void {
    if (localStorage.getItem('seller')) {
      this.isSellerLoggedIn.next(true);
      this.router.navigate(['seller-home']);
    }
  }

  userLogin(data: login): void {
    this.http.get(`http://localhost:3000/seller?email=${data.email}&password=${data.password}`, { observe: 'response' })
      .pipe(
        map((result: any) => result.body)
      )
      .subscribe((body: any[]) => {
        console.warn(body);
        if (body && body.length === 1) {
          this.isLoginError.next(false);
          localStorage.setItem('seller', JSON.stringify(body));
          this.router.navigate(['seller-home']);
        } else {
          console.warn('Login failed');
          this.isLoginError.next(true);
        }
      });
  }
}

