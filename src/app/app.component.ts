import { Component, EventEmitter } from '@angular/core';
import { JwtService } from './jwt.service';
import { firstValueFrom, Observable } from 'rxjs';
import { User } from './models/user.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'pythiaUI';
  username: Observable<string>;

  constructor(public jwtService: JwtService) { }

  ngOnInit(): void {
    this.username = this.getUser();
  }

  getUser(): Observable<any> {
    return this.jwtService.getCurrentUser();
  } 
}
