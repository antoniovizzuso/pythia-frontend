import { Component, ElementRef, Input, OnInit, QueryList, ViewChildren, OnChanges, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Template } from '../models/template.model';
import { Result } from '../models/result.model';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import Prism from 'prismjs';
import 'prismjs/components/prism-sql';

@Component({
  selector: 'app-output-view',
  templateUrl: './output-view.component.html',
  styleUrls: ['./output-view.component.css'],
})
export class OutputViewComponent implements OnChanges {
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

  closeResult = '';

  private highlightingContents!: QueryList<ElementRef>;

  constructor(public http: HttpClient, public modalService: NgbModal, private changeDetector : ChangeDetectorRef) {}

  ngOnChanges(): void {
    if (this.scenarioName) {
      this.loadTemplates();
    }

    //Strategies
    this.strategies.set('contradicting', 'Contradictory (default)');
    this.strategies.set('uniform_true', 'Uniform True');
    this.strategies.set('uniform_false', 'Uniform False');
    this.selectedStrategy = 'contradicting';
  }

  ngAfterViewInit() {
    this.highlightingContents.changes.subscribe(() => {
      this.highlightingContents.toArray().forEach((element) => {
        Prism.highlightElement(element.nativeElement);
      });
    });
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

  @ViewChildren('highlightingContent') set content(content: QueryList<ElementRef>) {
    if(content) { 
         this.highlightingContents = content;
         this.highlightingContents.toArray().forEach((element) => {
          Prism.highlightElement(element.nativeElement);
        });
    }
 }

  get selectedTemplate(): [string, string, string[], string] | undefined {
    let result: [string, string, string[], string] | undefined = undefined;
    if(this.selectedStructure) {
      this.templates!.forEach(t => {
        if(t[3] == this.selectedStructure) {
          result = t;
        }
      });
    }
    return result;
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

  onClickEdit(content: any) {
    this.modalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        size: 'lg',
        centered: true,
      })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
      this.changeDetector.detectChanges();
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
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
        });
    } catch (error) {
      console.log(error);
    }
  }

  getOperators(type: string): string[] {
    let operators: string[] = [];
    if (type == 'attribute' || type == 'row' || type == 'full') {
      operators.push('=');
      operators.push('>');
      operators.push('<');
      operators.push('<>');
    }
    return operators;
  }

  //*--- Prism methods ---*

  updateSqlText(index: number) {
    let test: string = '';
    let contents = this.highlightingContents!.toArray();
    if (contents[index]) {
      console.log("*** Highlighted!")

      // Update code
      contents[index].nativeElement.textContent = this.templates![index][0];

      // Syntax Highlight
      Prism.highlightElement(contents[index].nativeElement);
    }
  }

}
