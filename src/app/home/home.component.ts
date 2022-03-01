import { Component, OnInit, EventEmitter } from '@angular/core';
import { Entry } from '../models/entry.model';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { JwtService } from '../jwt.service';
import { HttpClient } from '@angular/common/http';
import { HttpResponse } from '../models/httpresponse.model';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  idScenarioSelected: number = 0; //0: nessuno, 1: load scenario, 2: new scenario
  entries: Entry[] = new Array();
  fileToUpload: File | null = null;
  scenarioName: string | null = null;
  listScenarios: Map<string, string> = new Map<string, string>();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private jwtService: JwtService,
    public http: HttpClient
  ) {
  }

  ngOnInit(): void {
    this.loadListScenarios();
  }

  loadListScenarios(): void {
    try {
      this.http.get<HttpResponse>("http://127.0.0.1:8080/api/getscenarios/").subscribe(val => this.listScenarios = val.content as Map<string, string>);
    } catch (error) {
      console.log(error);
    }
  }

  onScenarioSelected(event: any) {
    this.scenarioName = event.target.value;
  }

  loadScenario(): void {
    this.idScenarioSelected = 1;
  }

  newScenario(): void {
    //this.refreshComponent();
    this.idScenarioSelected = 2;
  }

  loadFile(file: File | null) {
    this.fileToUpload = file;
  }

  loadScenarioName(name: string) {
    this.scenarioName = name;
  }

  refreshComponent() {
    this.router.navigate([this.router.url]);
  }
}
