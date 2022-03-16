import { HttpClient } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnChanges,
} from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { Scenario } from '../models/scenario.model';
import { Template } from '../models/template.model';
import { Attribute } from '../models/attribute.model';
import { Result } from '../models/result.model';

@Component({
  selector: 'app-metadata',
  templateUrl: './metadata.component.html',
  styleUrls: ['./metadata.component.css'],
})
export class MetadataComponent implements OnChanges {
  @Input() scenarioName: string | null = null;
  scenario: Scenario | undefined;
  templates: Template[] | undefined;
  form: FormGroup;

  get attributes(): Attribute[] {
    return this.scenario!.attributes;
  }

  get primaryKeys(): Attribute {
    return this.scenario!.pk!;
  }

  includeCompositeKeys(i: number, attributeName: string): boolean {
    let result: boolean = false;
    let firstRow: Attribute[] = this.scenario!.compositeKeys[i];
    if (firstRow) {
      firstRow.forEach((element) => {
        if(element.normalizedName == attributeName) {
          result = true;
        }
      });
    }
    return result;
  }

  includeFunctionalDependencies(i: number, attributeName: string): boolean {
    let result: boolean = false;
    if (this.scenario!.fds.length > 0) {
      let firstRow: Attribute[] = this.scenario!.fds[i][0];
      if (firstRow) {
        for (let index = 0; index < firstRow.length - 1; index++) {
          const element = firstRow[index];
          if (element.normalizedName == attributeName) {
            result = true;
          }
        }
      }
    }
    return result;
  }

  isAttrDependecy(i: number, attributeName: string): boolean {
    let result: boolean = false;
    if (this.scenario!.fds.length > 0) {
      let firstRow: Attribute[] = this.scenario!.fds[i][0];
      if (firstRow) {
        if(firstRow[firstRow.length - 1].normalizedName == attributeName) {
          result = true;
        }
      }
    }
    return result;
  }

  constructor(fb: FormBuilder, public http: HttpClient) {
    this.form = fb.group({
      selectedPk: new FormArray([]),
      selectedCompositeKeys: new FormArray([]),
    });
  }

  ngOnChanges(): void {
    if (this.scenarioName) this.loadMetadata();
  }

  loadMetadata() {
    try {
      this.http
        .get<string>('http://127.0.0.1:8080/scenario/get/' + this.scenarioName)
        .subscribe((val) => {
          this.scenario = <Scenario>JSON.parse(val);
        });
    } catch (error) {
      console.log(error);
    }
  }

  loadTemplates() {
    try {
      this.http
        .get<Template[]>(
          'http://127.0.0.1:8080/scenario/templates/' + this.scenarioName
        )
        .subscribe((val) => {
          this.templates = val;
        });
    } catch (error) {
      console.log(error);
    }
  }

  findPks() {
    try {
      this.http
        .get<string>(
          'http://127.0.0.1:8080/scenario/find/pk/' + this.scenarioName
        )
        .subscribe((val) => {
          this.scenario = <Scenario>JSON.parse(val);
        });
    } catch (error) {
      console.log(error);
    }
  }

  findCks() {
    try {
      this.http
        .get<string>(
          'http://127.0.0.1:8080/scenario/find/cks/' + this.scenarioName
        )
        .subscribe((val) => {
          this.scenario = <Scenario>JSON.parse(val);
        });
    } catch (error) {
      console.log(error);
    }
  }

  findFds() {
    try {
      this.http
        .get<string>(
          'http://127.0.0.1:8080/scenario/find/fds/' + this.scenarioName
        )
        .subscribe((val) => {
          this.scenario = <Scenario>JSON.parse(val);
        });
    } catch (error) {
      console.log(error);
    }
  }

  onPkChange(event: any) {
    event.preventDefault();
    if (this.scenario) {
      const selectedPk = this.form.controls['selectedPk'] as FormArray;
      let pk: Attribute | undefined = this.scenario.attributes.find(
        (x) => x.normalizedName == event.target.value
      );
      selectedPk.reset();
      selectedPk.push(new FormControl(pk));
      this.scenario.pk = pk!;
      event.target.checked = true;
    }
  }

  checkboxClick(event: any) {
    event.preventDefault();
  }

  onCkChange(i: number, event: any) {
    if (this.scenario) {
      const compositeKeys = this.form.controls[
        'selectedCompositeKeys'
      ] as FormArray;
      let ck: Attribute | undefined = this.scenario.attributes.find(
        (x) => x.normalizedName == event.target.value
      );
      if (event.target.checked) {
        compositeKeys.push(new FormControl(ck!.normalizedName));
        if (!this.scenario.compositeKeys[i])
          this.scenario.compositeKeys[i] = [];
        this.scenario.compositeKeys[i].push(ck!);
      } else {
        const index = compositeKeys.controls.findIndex((x) => x.value === ck);
        compositeKeys.removeAt(index);
        this.scenario!.compositeKeys[i].forEach((element, index) => {
          if (element.normalizedName == ck?.normalizedName)
            this.scenario!.compositeKeys[i].splice(index, 1);
        });
      }
    }
  }

  save() {
    try {
      const formData = new FormData();
      formData.append('scenario', JSON.stringify(this.scenario));
      this.http
        .post<string>(
          'http://127.0.0.1:8080/scenario/save/' + this.scenarioName,
          formData
        )
        .subscribe((val) => {
          this.scenario = <Scenario>JSON.parse(val);
        });
    } catch (error) {
      console.log(error);
    }
  }
}
