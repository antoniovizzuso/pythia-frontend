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
  pages: string[] = new Array();
  attrsNumber: number = 0;
  selectedPage: number = 1;
  rowsPerPage: number = 10;

  constructor(public http: HttpClient) {}

  ngOnChanges(): void {
    try {
      this.http
        .get<string>(
          Constants.API_ENDPOINT + 'scenario/dataframe/' + this.scenarioName
        )
        .subscribe((val) => { 
          this.dataFrame = val; 
          this.getPages(1);
          this.attrsNumber = ( this.dataFrame.match(/\<\/th\>/g) || []).length - 11;
          this.attrsNumberEvent.emit(this.attrsNumber);
        });
    } catch (error) {
      console.log(error);
    }
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
