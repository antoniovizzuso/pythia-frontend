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

  structures: Map<string, string> = new Map<string, string>();
  strategies: Map<string, string> = new Map<string, string>();

  selectedStrategy: string = '';
  selectedStructure: string = '';

  //results: [string[][], string[][], string] | null = null;
  results: string[] | null = null;
  selectedResult: string | null = null;

  constructor(public http: HttpClient) {}

  ngOnInit(): void {
    //if (this.scenarioName) this.loadStrategies();
    //Structures
    // this.structures.set("attribute", "Attribute Ambiguity");
    // this.structures.set("row", "Row Ambiguity");
    // this.structures.set("fd", "FD Ambiguity");
    // this.structures.set("func", "Function Ambiguity??");
    // this.structures.set("full", "Full Ambiguity??");
    // this.selectedStructure = "attribute"

    //Strategies
    this.strategies.set('contradicting', 'Contradictory (default)');
    this.strategies.set('uniform_true', 'Uniform True');
    this.strategies.set('uniform_false', 'Uniform False');
    this.selectedStrategy = 'contradicting';
  }

  loadStrategies() {
    let templates: Template[] = [];
    try {
      this.http
        .get<Template[]>(
          'http://127.0.0.1:8080/api/scenario/templates/' + this.scenarioName
        )
        .subscribe((val) => {
          templates = val as Template[];
          //Structures
          templates.forEach((t) => {
            this.structures.set(t.name, t.name);
          });
          this.selectedStructure = templates[0].name;
        });
    } catch (error) {
      console.log(error);
    }
  }

  generate() {
    this.results = new Array();
    try {
      const formData = new FormData();
      formData.append('name', this.scenarioName as string);
      formData.append('strategy', this.selectedStrategy);
      formData.append('structure', this.selectedStructure);
      //this.http.post<HttpResponse>("http://127.0.0.1:8080/api/predict/", formData).subscribe(val => this.results = val.content as [string[][], string[][], string]);
      this.http
        .post<string[][]>('http://127.0.0.1:8080/api/predict/', formData)
        .subscribe((val) => {
          console.log(val);
          let temp :string[][];
          temp = val as string[][];
          temp.forEach(element => {
            this.results?.push(element[0]);
            console.log(element[0])
          });
        });
    } catch (error) {
      console.log(error);
    }
  }

  onSelectStrategy(event: any) {
    this.selectedStrategy = event.target.value;
    console.log('strategy: ' + this.selectedStrategy);
  }

  onSelectStructure(event: any) {
    this.selectedStructure = event.target.value;
    console.log('structure: ' + this.selectedStructure);
  }

  onClickView(row: number) {
    if (this.results) {
      this.selectedResult = this.results[row][0];
    }
  }
}
