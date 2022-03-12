import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-load-scenario',
  templateUrl: './load-scenario.component.html',
  styleUrls: ['./load-scenario.component.css'],
})
export class LoadScenarioComponent implements OnInit {
  @Input() scenarioName: string | null = null;
  @Output() deletedScenearioEvent = new EventEmitter<string>();
  dataFrame: string | null = null;
  pages: string[] = new Array();
  selectedPage: number = 1;
  rowsPerPage: number = 10;
  showTable: boolean = false;

  constructor(public http: HttpClient) {}

  ngOnInit(): void {
    try {
      this.http
        .get<string>(
          'http://127.0.0.1:8080/scenario/dataframe/' + this.scenarioName
        )
        .subscribe((val) => { 
          this.dataFrame = val; 
          this.getPages(1);
          this.showTable = true;
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
      this.http.delete("http://127.0.0.1:8080/scenario/delete/" + this.scenarioName).subscribe(val => {
        this.deletedScenearioEvent.emit(this.scenarioName!);
      });
    } catch(error) {
      console.log(error)
    }
  }
}
