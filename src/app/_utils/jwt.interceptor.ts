import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { finalize, Observable } from 'rxjs';
import { JwtService } from '../jwt.service';
import { SpinnerLoaderService } from '../spinner-loader.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    private totalRequests = 0;
    
    constructor(private authenticationService: JwtService, private spinnerLoaderService: SpinnerLoaderService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        let token = localStorage.getItem('access_token');
        if (token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
        }
        
        this.totalRequests++;
        this.spinnerLoaderService.setLoading(true);

        return next.handle(request).pipe(
            finalize(() => {
              this.totalRequests--;
              if (this.totalRequests === 0) {
                this.spinnerLoaderService.setLoading(false);
              }
            })
          );
    }
}