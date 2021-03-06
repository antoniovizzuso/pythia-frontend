import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
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

  closeResult = '';

  constructor(public http: HttpClient, public modalService: NgbModal) {}

  ngOnChanges(): void {
    this.loadScenario();
  }

  loadScenario() {
    try {
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

  onClickDelete(content: any) {
    this.modalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
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

  delete() {
    try {
      this.http.delete(Constants.API_ENDPOINT + "scenario/delete/" + this.scenarioName).subscribe(val => {
        this.deletedScenearioEvent.emit(this.scenarioName!);
        this.modalService.dismissAll()
      });
    } catch(error) {
      console.log(error)
    }
  }
}
