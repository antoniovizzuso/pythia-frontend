import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Constants } from 'src/constants';

@Component({
  selector: 'app-load-scenario',
  templateUrl: './load-scenario.component.html',
  styleUrls: ['./load-scenario.component.css'],
})
export class LoadScenarioComponent implements OnChanges {
  @Input() scenarioName: string | null = null;
  @Output() deletedScenearioEvent = new EventEmitter<string>();
  @Output() attrsNumberEvent = new EventEmitter<number>();
  dataFrame: string | null = null;
  attrsNumber: number = 0;

  //pagination
  rowsCount!: number;
  rowsOffset: number = 0;
  rowsLimit: number = 10;
  rowsPerPage: number = 10;
  selectedPage: number = 1;
  pagesLimit: number = 8;
  groupPage: number = 0;
  pages: string[] = new Array();



  constructor(public http: HttpClient) {}

  ngOnChanges(): void {
    this.loadScenario();
  }

  loadScenario() {
    try {
      console.log("*** " + this.rowsOffset + ", " + this.rowsLimit);
      this.http
        .get<string>(
          Constants.API_ENDPOINT + 'scenario/dataframe/' + this.scenarioName + "/" + this.rowsOffset + "/" + this.rowsLimit
        )
        .subscribe((val) => { 
          this.dataFrame = val; 
          this.getDatasetCount();
          this.attrsNumber = ( this.dataFrame.match(/\<\/th\>/g) || []).length - 11;
          this.attrsNumberEvent.emit(this.attrsNumber);
        });
    } catch (error) {
      console.log(error);
    }
  }

  getDatasetCount() {
    try {
      this.http
        .get<number>(
          Constants.API_ENDPOINT + 'scenario/dataframe/count/' + this.scenarioName
        )
        .subscribe((val) => { 
          this.rowsCount = val; 
          this.getPages();
        });
    } catch (error) {
      console.log(error);
    }
  }

  getPages() {
    this.pages = new Array();
    let total = Math.round(this.rowsCount / this.rowsPerPage);
    for (let i = 0; i < total; i++) {
      if (i < (this.pagesLimit + this.groupPage) && i >= this.groupPage) {
        this.pages.push((i+1).toString());
      }
    }
  }

  onClickPage(value: number) {
    this.selectedPage = value - 1;
    this.rowsOffset = this.selectedPage * this.rowsPerPage;
    this.rowsLimit = this.rowsOffset + this.rowsPerPage;
    this.loadScenario();
  }

  onClickPrevGroupPage() {
    this.groupPage -= this.pagesLimit;
    this.onClickPage(this.groupPage + 1);
  }

  onClickNextGroupPage() {
    this.groupPage += this.pagesLimit;
    this.onClickPage(this.groupPage + 1);
  }

  isHiddenNextGroupPage(): boolean {
    let total = Math.round(this.rowsCount / this.rowsPerPage);
    return total < (this.pagesLimit + this.groupPage);
  }

  delete() {
    try {
      this.http.delete(Constants.API_ENDPOINT + "scenario/delete/" + this.scenarioName).subscribe(val => {
        this.deletedScenearioEvent.emit(this.scenarioName!);
      });
    } catch(error) {
      console.log(error)
    }
  }
}
