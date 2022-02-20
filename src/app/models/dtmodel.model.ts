import { DTRow } from './dtrow.model';

export class DTModel {
    _name: string = "";
    _headers: string[] = new Array();
    _rows: DTRow[] = new Array();
}