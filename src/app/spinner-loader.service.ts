import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerLoaderService {
  private isLoading$$ = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading$$.asObservable();
  
  setLoading(isLoading: boolean) {
    this.isLoading$$.next(isLoading);
  }
}