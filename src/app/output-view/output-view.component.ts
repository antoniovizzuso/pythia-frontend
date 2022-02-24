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

  structures: Map<string, string> = new Map<string, string>();
  strategies: Map<string, string> = new Map<string, string>();

  //results: [string[][], string[][], string] | null = null;
  results: any[][];
  selectedResult: any[][];

  constructor(public http: HttpClient) {}

  ngOnInit(): void {
    //Structures
    this.structures.set("attribute", "Attribute Ambiguity");
    this.structures.set("row", "Row Ambiguity");
    this.structures.set("fd", "FD Ambiguity");

    //Strategies
    this.strategies.set("contradicting", "Contradictory (default)");
    this.strategies.set("uniform_true", "Uniform True");
    this.strategies.set("uniform_false", "Uniform False");
  }

  generate() {
    try {
      const formData = new FormData();
      formData.append('file', this.file as Blob, this.file?.name);
      formData.append('strategy', 'schema');
      //this.http.post<HttpResponse>("http://127.0.0.1:8080/api/predict/", formData).subscribe(val => this.results = val.content as [string[][], string[][], string]);
      this.http.post<HttpResponse>("http://127.0.0.1:8080/api/predict/", formData).subscribe(val => {
        console.log(val.content)
        this.results = val.content as any[][]
      });
    } catch (error) {
      console.log(error);
    }
  }

  onClickView(row: number) {
    this.selectedResult = this.results[row];
  }
}
