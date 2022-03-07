import { DTRow } from './dtrow.model';
import { MetadataDataSet } from './metadatadataset.model';
import { Template } from './template.model';

export class DTModel {
    _name: string = "";
    _rows: DTRow[] = new Array();
    _count: number;
    _metadata: MetadataDataSet = new MetadataDataSet();
    templates: Template[] = new Array();
}