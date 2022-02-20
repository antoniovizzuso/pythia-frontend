import { Component, Input, OnInit } from '@angular/core';
import { DTModel } from '../models/dtmodel.model';

@Component({
  selector: 'app-composite-keys',
  templateUrl: './composite-keys.component.html',
  styleUrls: ['./composite-keys.component.css']
})
export class CompositeKeysComponent implements OnInit {

  @Input() data: DTModel | null = null;
  constructor() { }

  ngOnInit(): void {
  }

}
