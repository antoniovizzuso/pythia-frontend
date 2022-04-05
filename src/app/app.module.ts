import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NewScenarioComponent } from './new-scenario/new-scenario.component';
import { FileInputDirective } from './file-input.directive';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SplitPipe } from './split.pipe';
import { HttpService } from './httpservice.service';
import { OutputViewComponent } from './output-view/output-view.component';
import { JwtModule } from '@auth0/angular-jwt';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JwtInterceptor } from './_utils/jwt.interceptor';
import { MetadataComponent } from './metadata/metadata.component';
import { LoadScenarioComponent } from './load-scenario/load-scenario.component';
import { Constants } from '../constants';

export function tokenGetter() {
  return localStorage.getItem('access_token');
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NewScenarioComponent,
    FileInputDirective,
    SplitPipe,
    OutputViewComponent,
    LoginComponent,
    MetadataComponent,
    LoadScenarioComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: [Constants.API_ENDPOINT],
        disallowedRoutes: [Constants.API_ENDPOINT + 'auth/login'],
      },
    }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
