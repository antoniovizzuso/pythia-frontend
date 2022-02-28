import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { finalize, Observable, tap } from 'rxjs';
import { JwtService } from '../jwt.service';
import { SpinnerLoaderService } from '../spinner-loader.service';
import { Router } from '@angular/router';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  private totalRequests = 0;

  constructor(
    private authenticationService: JwtService,
    private spinnerLoaderService: SpinnerLoaderService,
    private router: Router
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    let token = localStorage.getItem('access_token');
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    this.totalRequests++;
    this.spinnerLoaderService.setLoading(true);

    return next.handle(request).pipe(
      tap(null, error => {
        if (error.status === 401) {
          this.authenticationService.logout();
          this.router.navigate(["/login"]);
        }
      }),
      finalize(() => {
        this.totalRequests--;
        if (this.totalRequests === 0) {
          this.spinnerLoaderService.setLoading(false);
        }
      })
    );
  }
}
