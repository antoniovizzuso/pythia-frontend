import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { JwtService } from '../jwt.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm = this.formBuilder.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });
  loading = false;
  submitted = false;
  returnUrl: string = this.route.snapshot.queryParams['returnUrl'] || '/';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private jwtService: JwtService
  ) {
    // redirect to home if already logged in
    if (this.jwtService.loggedIn) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {}

  get username() {
    return this.loginForm?.get('username');
  }

  get password() {
    return this.loginForm?.get('password');
  }

  onSubmit() {
    this.submitted = true;

    // reset alerts on submit
    //this.alertService.clear();

    // stop here if form is invalid
    if (this.loginForm?.invalid) {
      return;
    }

    this.loading = true;
    this.jwtService
      .login(
        this.loginForm?.controls['username'].value,
        this.loginForm?.controls['password'].value
      )
      .pipe(first())
      .subscribe(
        (data) => {
          this.router.navigate([this.returnUrl]);
        },
        (error) => {
          //this.alertService.error(error);
          this.loading = false;
        }
      );
  }
}
