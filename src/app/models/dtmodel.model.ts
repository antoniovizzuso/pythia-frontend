import { DTRow } from './dtrow.model';
import { MetadataDataSet } from './metadatadataset.model';

export class DTModel {
    _name: string = "";
    _rows: DTRow[] = new Array();
    _count: number;
    _metadata: MetadataDataSet = new MetadataDataSet();
}