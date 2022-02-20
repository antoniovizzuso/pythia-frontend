import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DatagridComponent } from './datagrid/datagrid.component';
import { NewScenarioComponent } from './new-scenario/new-scenario.component';
import { FileInputDirective } from './file-input.directive';
import { HttpClientModule } from '@angular/common/http';
import { SplitPipe } from './split.pipe';
import { HttpService } from './httpservice.service';
import { OutputViewComponent } from './output-view/output-view.component';
import { PrimaryKeysComponent } from './primary-keys/primary-keys.component';
import { CompositeKeysComponent } from './composite-keys/composite-keys.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DatagridComponent,
    NewScenarioComponent,
    FileInputDirective,
    SplitPipe,
    OutputViewComponent,
    PrimaryKeysComponent,
    CompositeKeysComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
