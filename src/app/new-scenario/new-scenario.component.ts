import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DTModel } from '../models/dtmodel.model';
import { DTRow } from '../models/dtrow.model';
import { HttpService } from '../httpservice.service';
import { Observable } from 'rxjs';
import { HttpResponse } from '../models/httpresponse.model';

@Component({
  selector: 'app-new-scenario',
  templateUrl: './new-scenario.component.html',
  styleUrls: ['./new-scenario.component.css']
})
export class NewScenarioComponent implements OnInit {

  @Output() fileUploadEvent = new EventEmitter<File | null>();
  fileToUpload: File | null = null;
  data: DTModel | null = null;

  constructor(public http: HttpClient) { }

  ngOnInit(): void {
    this.fileToUpload = null;
    this.data = null;
  }

  handleFileInput(event: Event) {
    this.fileToUpload = (<HTMLInputElement>event.target).files!.item(0);
    this.fileUploadEvent.emit(this.fileToUpload);
  }

  uploadFile() {
    try {
      const formData = new FormData();
      formData.append('file', this.fileToUpload as Blob, this.fileToUpload?.name);
      this.http.post<HttpResponse>("http://127.0.0.1:8080/api/scenario/uploadFile/", formData).subscribe(val => this.showData(val.content));
    } catch(error) {
      console.log(error)
    }
  }

  showData(content: Object) {
    this.data = content as DTModel;
  }


}
