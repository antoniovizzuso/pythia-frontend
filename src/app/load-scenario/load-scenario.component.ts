import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DTModel } from '../models/dtmodel.model';
import { DTRow } from '../models/dtrow.model';
import { HttpService } from '../httpservice.service';
import { Observable } from 'rxjs';
import { HttpResponse } from '../models/httpresponse.model';
import { MetadataDataSet } from '../models/metadatadataset.model';

@Component({
  selector: 'app-load-scenario',
  templateUrl: './load-scenario.component.html',
  styleUrls: ['./load-scenario.component.css'],
})
export class LoadScenarioComponent implements OnInit {
  @Input() scenarioName: string | null = null;
  @Output() deletedScenearioEvent = new EventEmitter<string>();
  data: DTModel | null = null;
  pages: string[] = new Array();
  selectedPage: number = 1;
  rowsPerPage: number = 10;
  showTable: boolean = false;

  constructor(public http: HttpClient) {}

  ngOnInit(): void {
    try {
      this.http
        .get<HttpResponse>(
          'http://127.0.0.1:8080/api/loadscenario/' + this.scenarioName
        )
        .subscribe((val) => this.showData(val.content));
    } catch (error) {
      console.log(error);
    }
  }

  getMetadata() {
    try {
      const formData = new FormData();
      //formData.append('file', this.file as Blob, this.file?.name);
      this.http
        .post<HttpResponse>('http://127.0.0.1:8080/api/getmetadata/', formData)
        .subscribe(
          (val) => (this.data!._metadata = val.content as MetadataDataSet)
        );
    } catch (error) {
      console.log(error);
    }
  }

  showData(content: Object) {
    this.data = content as DTModel;
    this.getPages(this.data._count);
    this.showTable = true;
  }

  getPages(rowsCount: number) {
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

  loadMeta(meta: MetadataDataSet) {
    this.data!._metadata = meta;
    console.log(this.data!._metadata)
  }

  save() {
    try {
      const formData = new FormData();
      formData.append('name', this.scenarioName as string);
      formData.append('metadata', JSON.stringify(this.data?._metadata));
      this.http
        .post<HttpResponse>(
          'http://127.0.0.1:8080/api/scenario/update/',
          formData
        )
        .subscribe((val) => this.showData(val.content));
    } catch (error) {
      console.log(error);
    }
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
