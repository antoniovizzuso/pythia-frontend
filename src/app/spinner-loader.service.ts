import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerLoaderService {
  private isLoading$$ = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading$$.asObservable();
  
  setLoading(isLoading: boolean) {
    setTimeout(()=> {
      this.isLoading$$.next(isLoading);
    }, 0);
  }
}