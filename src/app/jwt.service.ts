import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Constants } from '../constants';

@Injectable({
  providedIn: 'root',
})
export class JwtService {
  constructor(private httpClient: HttpClient) {}

  login(email: string, password: string) {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);
    return this.httpClient
      .post<{ access_token: string }>(
        Constants.API_ENDPOINT + 'auth/login',
        formData
      )
      .pipe(
        tap((res) => {
          localStorage.setItem('access_token', res.access_token);
        })
      );
  }

  register(email: string, password: string) {
    return this.httpClient
      .post<{ access_token: string }>(Constants.API_ENDPOINT + 'auth/register', {
        email,
        password,
      })
      .pipe(
        tap((res) => {
          this.login(email, password);
        })
      );
  }

  logout() {
    localStorage.removeItem('access_token');
  }

  public getCurrentUser() {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Authorization', 'Barear ' + localStorage.getItem('access_token'));
    return this.httpClient
      .get<{ username: string }>(Constants.API_ENDPOINT + 'auth/me');
  }

  public get loggedIn(): boolean {
    return localStorage.getItem('access_token') !== null;
  }
}
