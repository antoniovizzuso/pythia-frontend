import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { MetadataDataSet } from '../models/metadatadataset.model';

@Component({
  selector: 'app-metadata',
  templateUrl: './metadata.component.html',
  styleUrls: ['./metadata.component.css'],
})
export class MetadataComponent implements OnInit {
  @Input() metadata: MetadataDataSet | undefined;
  @Output() metaEvent = new EventEmitter<MetadataDataSet>();

  form: FormGroup;

  get headers(): Array<string> {
    let hs: string[] = new Array<string>();
    this.metadata!.headers.forEach(element => {
      hs.push(element[0]);
    });
    return hs;
  }

  get primaryKeys(): Array<string> {
    return this.metadata!.pks;
  }

  get compositeKeys(): Array<string> {
    return this.metadata!.cks;
  }

  get functionalDependencies(): Array<string> {
    return this.metadata!.fds;
  }

  constructor(fb: FormBuilder) {
    this.form = fb.group({
      selectedPk: new FormArray([]),
      selectedCompositeKeys: new FormArray([])
    });
  }

  onPkChange(event: any) {
    const selectedPk = this.form.controls['selectedPk'] as FormArray;
    const pk = event.target.value
    if (event.target.checked) {
      selectedPk.push(new FormControl(pk));
      this.metadata!.pks.push(pk);
    } else {
      const index = selectedPk.controls.findIndex(
        (x) => x.value === pk
      );
      selectedPk.removeAt(index);
      this.metadata!.pks.forEach((element,index)=>{
        if(element==pk) this.metadata!.pks.splice(index, 1);
     });
    }
    this.metaEvent.emit(this.metadata!);
  }

  onCkChange(event: any) {
    const compositeKeys = this.form.controls['selectedCompositeKeys'] as FormArray;
    const ck = event.target.value.split(",")[0];
    if (event.target.checked) {
      compositeKeys.push(new FormControl(ck));
      this.metadata!.cks.push(ck);
    } else {
      const index = compositeKeys.controls.findIndex(
        (x) => x.value === ck
      );
      compositeKeys.removeAt(index);
      this.metadata!.cks.forEach((element,index)=>{
        if(element==ck) this.metadata!.cks.splice(index, 1);
     });
    }
    this.metaEvent.emit(this.metadata!);
  }

  ngOnInit(): void {}
}
