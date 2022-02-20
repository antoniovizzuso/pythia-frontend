import { Component, Input, OnInit } from '@angular/core';
import { DTModel } from '../models/dtmodel.model';

@Component({
  selector: 'app-primary-keys',
  templateUrl: './primary-keys.component.html',
  styleUrls: ['./primary-keys.component.css']
})
export class PrimaryKeysComponent implements OnInit {

  @Input() data: DTModel | null = null;
  constructor() { }

  ngOnInit(): void {
  }

}
