import { Component, OnInit } from '@angular/core';
import { Entry } from '../models/entry.model';
import {Router, NavigationEnd,ActivatedRoute} from '@angular/router';
import { JwtService } from '../jwt.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  idScenarioSelected: number = 0; //0: nessuno, 1: load scenario, 2: new scenario
  entries: Entry[] = new Array();
  fileToUpload: File | null = null;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private jwtService: JwtService) {}

  ngOnInit(): void {
  }

  loadScenario(): void {
    this.idScenarioSelected = 1;
    this.entries.push(new Entry(0, "Brazil", "Sao Paulo", 100, 20, 2, 2000));
  }

  newScenario(): void {
    this.refreshComponent();
    this.idScenarioSelected = 2;
  }

  loadFile(file: File | null) {
    this.fileToUpload = file;
  }

  refreshComponent(){
    this.router.navigate([this.router.url])
  }

}
