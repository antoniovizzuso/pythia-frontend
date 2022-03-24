import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Template } from '../models/template.model';
import { Result } from '../models/result.model';

@Component({
  selector: 'app-output-view',
  templateUrl: './output-view.component.html',
  styleUrls: ['./output-view.component.css'],
})
export class OutputViewComponent implements OnInit {
  @Input() scenarioName: string | null = null;

  strategies: Map<string, string> = new Map<string, string>();
  templates: Array<[string, string, string[], string]> | undefined;

  selectedStrategy: string = '';
  selectedStructure: string = '';
  limitResults: number = 5;

  //results: [string[][], string[][], string] | null = null;
  results: Result[] = [];
  selectedResult: Result | null = null;
  selectedAQuery: number = 0;
  selectedRow: number = 0;

  constructor(public http: HttpClient) {}

  ngOnInit(): void {
    if (this.scenarioName) {
      this.loadTemplates();
    }

    //Strategies
    this.strategies.set('contradicting', 'Contradictory (default)');
    this.strategies.set('uniform_true', 'Uniform True');
    this.strategies.set('uniform_false', 'Uniform False');
    this.selectedStrategy = 'contradicting';
  }

  loadTemplates() {
    try {
      this.http
        .get<string>(
          'http://127.0.0.1:8080/scenario/get/templates/' + this.scenarioName
        )
        .subscribe((val) => {
          this.templates = <Array<[string, string, string[], string]>>(
            JSON.parse(val)
          );
          this.selectedStructure = this.templates[0][3];
        });
    } catch (error) {
      console.log(error);
    }
  }

  onSelectStructure(event: any) {
    if (event.target.value) {
      this.selectedStructure = event.target.value;
      console.log('structure: ' + this.selectedStructure);
    }
  }

  onSelectStrategy(event: any) {
    this.selectedStrategy = event.target.value;
    console.log('*** strategy: ' + this.selectedStrategy);
  }

  onClickView(i: number, j: number) {
    if (this.results) {
      this.selectedAQuery = i;
      this.selectedRow = j;
      this.selectedResult = this.results[i];
    }
  }

  generate() {
    this.results = new Array();
    this.selectedResult = null;
    this.selectedAQuery = 0;
    try {
      const formData = new FormData();
      formData.append('strategy', this.selectedStrategy);
      formData.append('structure', this.selectedStructure);
      formData.append('limitResults', this.limitResults.toString());
      this.http
        .post<Result[]>(
          'http://127.0.0.1:8080/scenario/predict/' + this.scenarioName,
          formData
        )
        .subscribe((val) => {
          this.results = val;
          console.log('*** : ' + this.results[0]);
        });
    } catch (error) {
      console.log(error);
    }
  }
}
