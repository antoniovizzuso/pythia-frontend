import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpResponse } from '../models/httpresponse.model';
import { DTModel } from '../models/dtmodel.model';

@Component({
  selector: 'app-output-view',
  templateUrl: './output-view.component.html',
  styleUrls: ['./output-view.component.css'],
})
export class OutputViewComponent implements OnInit {
  @Input() file: File | null = null;

  results: [string[][], string[][], string] | null = null;

  constructor(public http: HttpClient) {}

  ngOnInit(): void {
  }

  generate() {
    try {
      const formData = new FormData();
      formData.append('file', this.file as Blob, this.file?.name);
      formData.append('strategy', 'schema');
      this.http.post<HttpResponse>("http://127.0.0.1:8080/api/predict/", formData).subscribe(val => this.results = val.content as [string[][], string[][], string]);
    } catch (error) {
      console.log(error);
    }
  }
}
