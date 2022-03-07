import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DTModel } from '../models/dtmodel.model';
import { DTRow } from '../models/dtrow.model';
import { HttpService } from '../httpservice.service';
import { Observable } from 'rxjs';
import { HttpResponse } from '../models/httpresponse.model';
import { MetadataDataSet } from '../models/metadatadataset.model';

@Component({
  selector: 'app-new-scenario',
  templateUrl: './new-scenario.component.html',
  styleUrls: ['./new-scenario.component.css']
})
export class NewScenarioComponent implements OnInit {
  @Output() fileUploadEvent = new EventEmitter<File | null>();
  @Output() scenarioSetEvent = new EventEmitter<string>();
  @Output() deletedScenearioEvent = new EventEmitter<string>();
  @Input() scenarioName: string | null = null;
  file: File | null = null;
  data: DTModel | null = null;
  pages: string[] = new Array();
  selectedPage: number = 1;
  rowsPerPage: number = 10;
  showTable: boolean = false;
  errorMessage: string = "";

  constructor(public http: HttpClient) { }

  ngOnInit(): void {
    this.file = null;
    this.data = null;
  }

  handleFileInput(event: Event) {
    this.file = (<HTMLInputElement>event.target).files!.item(0);
    this.fileUploadEvent.emit(this.file);
  }

  submitFile() {
    this.errorMessage = "";
    this.data = null;
    this.showTable = false;
    try {
      this.http.get<HttpResponse>("http://127.0.0.1:8080/api/scenario/check/" + this.file?.name).subscribe(val => 
      {
        if (!val.content) {
          this.uploadFile();
        } else {
          this.errorMessage = "this scenario already exists";
        }
      });
    } catch(error) {
      console.log(error)
    }
  }

  uploadFile() {
    try {
      const formData = new FormData();
      formData.append('file', this.file as Blob, this.file?.name);
      this.http.post<HttpResponse>("http://127.0.0.1:8080/api/scenario/uploadFile/", formData).subscribe(val => this.showData(val.content));
    } catch(error) {
      console.log(error)
    }
  }

  getMetadata() {
    try {
      const formData = new FormData();
      formData.append('file', this.file as Blob, this.file?.name);
      this.http.post<HttpResponse>("http://127.0.0.1:8080/api/getmetadata/", formData).subscribe(val => this.showData(val.content));
    } catch(error) {
      console.log(error)
    }
  }

  showData(content: Object) {
    this.data = content as DTModel;
    this.scenarioSetEvent.emit(this.data._name);
    this.getPages(this.data._count);
    this.showTable = true;
  }

  getPages(rowsCount: number) {
    this.pages = new Array();
    let visiblePages = 8;
    let total = Math.round(rowsCount / this.rowsPerPage);
    this.pages.push((1).toString());

    if(this.selectedPage > visiblePages/2) {
      this.pages.push('...');
    }

    if(this.selectedPage < total - visiblePages/2) {
      this.pages.push('...');
    }

    if (rowsCount > this.rowsPerPage) {
      this.pages.push(total.toString());
    }
  }

  loadMeta(meta: MetadataDataSet) {
    this.data!._metadata = meta;
    console.log(this.data!._metadata)
  }

  delete() {
    try {
      this.http.delete<HttpResponse>("http://127.0.0.1:8080/api/scenario/delete/" + this.scenarioName).subscribe(val => {
        this.deletedScenearioEvent.emit(this.scenarioName!);
      });
    } catch(error) {
      console.log(error)
    }
  }


}
