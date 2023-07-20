import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { login, signUp } from '../data-type';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  invalidUserAuth = new EventEmitter<boolean>(false);

  constructor(private http: HttpClient, private router: Router) { }

  userSignUp(user: signUp): void {
    this.http.post('http://localhost:3000/users', user, { observe: 'response' })
      .subscribe((result: any) => {
        if (result && result.body) {
          localStorage.setItem('user', JSON.stringify(result.body));
          this.router.navigate(['/']);
        }
      });
  }

  userLogin(data: login): void {
    this.http.get<signUp[]>(`http://localhost:3000/users?email=${data.email}&password=${data.password}`, { observe: 'response' })
      .pipe(
        map((result: any) => result.body)
      )
      .subscribe((body: signUp[]) => {
        if (body && body.length) {
          localStorage.setItem('user', JSON.stringify(body[0]));
          this.router.navigate(['/']);
          this.invalidUserAuth.emit(false);
        } else {
          this.invalidUserAuth.emit(true);
        }
      });
  }

  userAuthReload(): void {
    if (localStorage.getItem('user')) {
      this.router.navigate(['/']);
    }
  }
}
