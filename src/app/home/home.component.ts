import { Component, OnInit, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { JwtService } from '../jwt.service';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../../constants';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  idScenarioSelected: number = 0; //0: nessuno, 1: load scenario, 2: new scenario
  fileToUpload: File | null = null;
  scenarioSelected: string | null = null; 
  scenarioName: string = "";
  listScenarios: Map<string, string> = new Map<string, string>();
  errorMessage: string = "";
  attrsCount: number = 0;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private jwtService: JwtService,
    public http: HttpClient,
    private changeDetector : ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.loadListScenarios();
  }

  loadListScenarios(): void {
    try {
      this.http.get<Map<string, string>>(Constants.API_ENDPOINT + "scenario/get").subscribe(val => {
        this.listScenarios = val;
      });
    } catch (error) {
      console.log(error);
    }
  }

  onScenarioSelected(event: any) {
    this.scenarioSelected = event.target.value;
  }

  loadScenario(): void {
    this.errorMessage = "";
    if (this.scenarioSelected) {
      this.scenarioName = this.scenarioSelected!;
      this.scenarioSelected = null;
      this.idScenarioSelected = 1;
    } else {
      this.errorMessage = "select a scenario";
    }
  }

  newScenario(): void {
    this.scenarioName = "";
    this.idScenarioSelected = 0;
    this.idScenarioSelected = 2;
    this.changeDetector.detectChanges();
  }

  loadFile(file: File | null) {
    this.fileToUpload = file;
  }

  loadScenarioName(name: string) {
    this.scenarioName = name;
    this.loadListScenarios();
  }

  deletedScenario(): void {
    this.loadListScenarios();
    this.scenarioName = "";
    this.idScenarioSelected = 0;
  }

  setAttrsNumber(value: number) {
    this.attrsCount = value;
  }
}
