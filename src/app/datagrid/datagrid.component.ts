import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { DTModel } from '../models/dtmodel.model';
import { Entry } from '../models/entry.model';

@Component({
  selector: 'app-datagrid',
  templateUrl: './datagrid.component.html',
  styleUrls: ['./datagrid.component.css'],
})
export class DatagridComponent implements OnInit {

  @Input() data: DTModel | null = null

  constructor() {}

  ngOnInit(): void {
  }
}
