import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { MetadataDataSet } from '../models/metadatadataset.model';

@Component({
  selector: 'app-metadata',
  templateUrl: './metadata.component.html',
  styleUrls: ['./metadata.component.css'],
})
export class MetadataComponent implements OnInit {
  @Input() headers: string[] | undefined;
  @Input() metadata: MetadataDataSet | undefined;
  @Output() metaEvent = new EventEmitter<MetadataDataSet>();

  form: FormGroup;

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
    if (event.target.checked) {
      selectedPk.push(new FormControl(event.target.value));
      this.metadata!.pks.push(event.target.value);
    } else {
      const index = selectedPk.controls.findIndex(
        (x) => x.value === event.target.value
      );
      selectedPk.removeAt(index);
      this.metadata!.pks.forEach((element,index)=>{
        if(element==event.target.value) this.metadata!.pks.splice(index, 1);
     });
    }
    this.metaEvent.emit(this.metadata!);
  }

  onCkChange(event: any) {
    const compositeKeys = this.form.controls['selectedCompositeKeys'] as FormArray;
    if (event.target.checked) {
      compositeKeys.push(new FormControl(event.target.value));
      this.metadata!.cks.push(event.target.value);
    } else {
      const index = compositeKeys.controls.findIndex(
        (x) => x.value === event.target.value
      );
      compositeKeys.removeAt(index);
      this.metadata!.cks.forEach((element,index)=>{
        if(element==event.target.value) this.metadata!.cks.splice(index, 1);
     });
    }
    this.metaEvent.emit(this.metadata!);
  }

  ngOnInit(): void {}
}
