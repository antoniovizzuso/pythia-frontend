import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpService } from '../httpservice.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-new-scenario',
  templateUrl: './new-scenario.component.html',
  styleUrls: ['./new-scenario.component.css'],
})
export class NewScenarioComponent implements OnInit {
  @Output() fileUploadEvent = new EventEmitter<File | null>();
  @Output() scenarioSetEvent = new EventEmitter<string>();
  @Output() deletedScenearioEvent = new EventEmitter<string>();
  @Output() attrsNumberEvent = new EventEmitter<number>();
  @Input() scenarioName: string | null = null;
  file: File | null = null;
  dataFrame: string | null = null;
  pages: string[] = new Array();
  attrsNumber: number = 0;
  selectedPage: number = 1;
  rowsPerPage: number = 10;
  //showTable: boolean = false;
  errorMessage: string = '';

  constructor(public http: HttpClient) {}

  ngOnInit(): void {
    console.log("*** new scenario init");
    this.file = null;
    this.dataFrame = null;
  }

  handleFileInput(event: Event) {
    this.file = (<HTMLInputElement>event.target).files!.item(0);
    this.fileUploadEvent.emit(this.file);
  }

  submitFile() {
    this.errorMessage = '';
    this.dataFrame = null;
    //this.showTable = false;
    try {
      this.http
        .get<boolean>('http://127.0.0.1:8080/scenario/check/' + this.file?.name)
        .subscribe((val) => {
          if (!val) {
            this.uploadFile();
          } else {
            this.errorMessage = 'this scenario already exists';
          }
        });
    } catch (error) {
      console.log(error);
    }
  }

  uploadFile() {
    try {
      const formData = new FormData();
      formData.append('file', this.file as Blob, this.file?.name);
      this.http
        .post<string>('http://127.0.0.1:8080/scenario/create', formData)
        .subscribe((val) => {
          if (val) {
            this.scenarioName = val;
            this.loadScenario();
            this.scenarioSetEvent.emit(this.scenarioName);
          }
        });
    } catch (error) {
      console.log(error);
    }
  }

  loadScenario() {
    try {
      this.http
        .get<string>(
          'http://127.0.0.1:8080/scenario/dataframe/' + this.scenarioName
        )
        .subscribe((val) => {
          this.dataFrame = val;
          this.getPages(1);
          //this.showTable = true;
          this.attrsNumber = ( this.dataFrame.match(/\<\/th\>/g) || []).length - 11;
          this.attrsNumberEvent.emit(this.attrsNumber);
        });
    } catch (error) {
      console.log(error);
    }
  }

  getPages(rowsCount: number) {
    this.pages = new Array();
    let visiblePages = 8;
    let total = Math.round(rowsCount / this.rowsPerPage);
    this.pages.push((1).toString());

    if (this.selectedPage > visiblePages / 2) {
      this.pages.push('...');
    }

    if (this.selectedPage < total - visiblePages / 2) {
      this.pages.push('...');
    }

    if (rowsCount > this.rowsPerPage) {
      this.pages.push(total.toString());
    }
  }

  delete() {
    try {
      this.http
        .delete('http://127.0.0.1:8080/scenario/delete/' + this.scenarioName)
        .subscribe((val) => {
          this.deletedScenearioEvent.emit(this.scenarioName!);
        });
    } catch (error) {
      console.log(error);
    }
  }
}
