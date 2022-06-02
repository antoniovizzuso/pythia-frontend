import { HttpClient } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnChanges,
  ViewChildren,
  QueryList,
  ElementRef,
  ViewChild,
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormArray,
  FormControl,
  Validators,
} from '@angular/forms';
import { Scenario } from '../models/scenario.model';
import { Template } from '../models/template.model';
import { Attribute } from '../models/attribute.model';
import Prism from 'prismjs';
import 'prismjs/components/prism-sql';
import { Constants } from 'src/constants';

@Component({
  selector: 'app-metadata',
  templateUrl: './metadata.component.html',
  styleUrls: ['./metadata.component.css'],
})
export class MetadataComponent implements OnChanges {
  @Input() scenarioName: string | null = null;
  scenario: Scenario | undefined;
  templates: Array<[string, string, string[], string]> | undefined;

  formPk: FormGroup;
  formCk: FormGroup;
  submittedCk = false;
  formFds: FormGroup;
  submittedFd = false;
  formTemplate: FormGroup;
  submittedTemplate = false;
  formAmbiguous: FormGroup;
  submittedAmbiguous = false;

  fdEditable: number = -1;
  ambiguousEditable: number = -1;

  newCk: Attribute[] = new Array();
  newFd: Attribute[] = new Array();
  newFdDependency: Attribute | undefined;
  newTemplate: string | undefined;
  newAttr1Ambiguous: Attribute | undefined;
  newAttr2Ambiguous: Attribute | undefined;

  expandedTemplate: number = -1;

  editableTemplate: number = -1;
  editableOperator: string = "";
  printFtoSave: string = "";


  //Spinner properties
  loadFindPk: boolean = false;
  loadFindCks: boolean = false;
  loadFindFds: boolean = false;
  loadFindAmbiguous: boolean = false;

  @ViewChildren('highlightingContent')
  highlightingContents!: QueryList<ElementRef>;

  get attributes(): Attribute[] {
    let result: Attribute[] = [];
    if (this.scenario) {
      result = this.scenario.attributes;
    }
    return result;
  }

  get primaryKeys(): Attribute {
    return this.scenario!.pk!;
  }

  constructor(fb: FormBuilder, public http: HttpClient) {
    this.formPk = fb.group({
      selectedPk: new FormArray([]),
    });
    this.formCk = fb.group({
      selectedCompositeKeys: new FormArray([]),
    });
    this.formFds = fb.group({
      selectedFds: new FormArray([]),
      fdAttr: new FormControl('', Validators.required),
    });
    this.formTemplate = fb.group({
      queryTemplate: new FormControl('', Validators.required),
      typeTemplate: new FormControl('', Validators.required),
      operatorsTemplate: new FormArray([]),
    });
    this.formAmbiguous = fb.group({
      ambiguousLabel: new FormControl('', Validators.required),
    });
  }

  ngOnChanges(): void {
    if (this.scenarioName) {
      this.loadMetadata();
      this.loadTemplates();
    }
  }

  ngAfterViewInit() {
    this.highlightingContents.changes.subscribe(() => {
      this.highlightingContents.toArray().forEach((element) => {
        Prism.highlightElement(element.nativeElement);
      });
    });
  }

  loadMetadata() {
    try {
      this.http
        .get<string>(
          Constants.API_ENDPOINT + 'scenario/get/' + this.scenarioName
        )
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
        .get<string>(
          Constants.API_ENDPOINT + 'scenario/get/templates/' + this.scenarioName
        )
        .subscribe((val) => {
          this.templates = <Array<[string, string, string[], string]>>(
            JSON.parse(val)
          );
        });
    } catch (error) {
      console.log(error);
    }
  }

  findPks() {
    try {
      this.loadFindPk = true;
      this.http
        .get<string>(
          Constants.API_ENDPOINT + 'scenario/find/pk/' + this.scenarioName
        )
        .subscribe((val) => {
          this.scenario = <Scenario>JSON.parse(val);
          this.loadFindPk = false;
        });
    } catch (error) {
      console.log(error);
    }
  }

  findCks() {
    try {
      this.loadFindCks = true;
      this.http
        .get<string>(
          Constants.API_ENDPOINT + 'scenario/find/cks/' + this.scenarioName
        )
        .subscribe((val) => {
          this.scenario = <Scenario>JSON.parse(val);
          this.loadFindCks = false;
        });
    } catch (error) {
      console.log(error);
    }
  }

  findFds() {
    try {
      this.loadFindFds = true;
      this.http
        .get<string>(
          Constants.API_ENDPOINT + 'scenario/find/fds/' + this.scenarioName
        )
        .subscribe((val) => {
          this.scenario = <Scenario>JSON.parse(val);
          this.loadFindFds = false;
        });
    } catch (error) {
      console.log(error);
    }
  }

  findAmbiguous() {
    try {
      this.loadFindAmbiguous = true;
      this.http
        .get<string>(
          Constants.API_ENDPOINT +
            'scenario/find/ambiguous/' +
            this.scenarioName
        )
        .subscribe((val) => {
          this.scenario = <Scenario>JSON.parse(val);
          this.loadFindAmbiguous = false;
        });
    } catch (error) {
      console.log(error);
    }
  }

  includeCompositeKeys(i: number, attributeName: string): boolean {
    let result: boolean = false;
    let firstRow: Attribute[] = this.scenario!.compositeKeys[i];
    if (firstRow) {
      firstRow.forEach((element) => {
        if (element.normalizedName == attributeName) {
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

  getAttrDependency(i: number): string {
    let result: string = '';
    if (this.scenario!.fds.length > 0) {
      let firstRow: Attribute[] = this.scenario!.fds[i][0];
      if (firstRow) {
        result = firstRow[firstRow.length - 1].name;
      }
    }
    return result;
  }

  includeAttrDependency(attributeName: string): boolean {
    let result: boolean = false;
    this.newFd.forEach((element) => {
      if (element.normalizedName == attributeName) {
        result = true;
      }
    });
    return result;
  }

  onPkChange(event: any) {
    event.preventDefault();
    if (this.scenario) {
      const selectedPk = this.formPk.controls['selectedPk'] as FormArray;
      let pk: Attribute | undefined = this.scenario.attributes.find(
        (x) => x.normalizedName == event.target.value
      );
      selectedPk.reset();
      selectedPk.push(new FormControl(pk));
      this.scenario.pk = pk!;
      event.target.checked = true;
    }
  }

  onCkChange(event: any) {
    if (this.scenario) {
      const compositeKeys = this.formCk.controls[
        'selectedCompositeKeys'
      ] as FormArray;
      let ck: Attribute | undefined = this.scenario.attributes.find(
        (x) => x.normalizedName == event.target.value
      );
      if (event.target.checked) {
        compositeKeys.push(new FormControl(ck!));
        this.newCk.push(ck!);
      } else {
        const index = compositeKeys.controls.findIndex(
          (x) => x.value === ck?.normalizedName
        );
        compositeKeys.removeAt(index);
        this.newCk.forEach((element, index) => {
          if (element.normalizedName == ck?.normalizedName)
            this.newCk.splice(index, 1);
        });
      }
    }
  }

  onFdChange(event: any) {
    if (this.scenario) {
      const fds = this.formFds.controls['selectedFds'] as FormArray;
      let fd: Attribute | undefined = this.scenario.attributes.find(
        (x) => x.normalizedName == event.target.value
      );
      if (event.target.checked) {
        fds.push(new FormControl(fd!));
        this.newFd.push(fd!);
      } else {
        const index = fds.controls.findIndex(
          (x) => x.value === fd?.normalizedName
        );
        fds.removeAt(index);
        this.newFd.forEach((element, index) => {
          if (element.normalizedName == fd?.normalizedName)
            this.newFd.splice(index, 1);
        });
      }
      if (this.includeAttrDependency(this.newFdDependency?.normalizedName!)) {
        this.newFdDependency = undefined;
      }
    }
  }

  onFdDependencyChange(event: any) {
    if (this.scenario) {
      let attr: Attribute | undefined = this.scenario.attributes.find(
        (x) => x.normalizedName == event.target.value
      );
      this.newFdDependency = attr;
    }
  }

  onAmbiguousAttrChange(event: any, attrIndex: number) {
    let attr: Attribute | undefined = this.scenario!.attributes.find(
      (x) => x.normalizedName == event.target.value
    );
    if (attr) {
      if (attrIndex == 0) this.newAttr1Ambiguous = attr;
      if (attrIndex == 1) this.newAttr2Ambiguous = attr;
    }
  }

  onTemplataTypeChange(event: any) {
    this.newTemplate = event.target.value;
  }

  getOperators(type: string): string[] {
    let operators: string[] = [];
    if (type != 'fd') {
      operators.push('=');
      operators.push('>');
      operators.push('<');
      operators.push('<>');
    }
    return operators;
  }

  selectOperator(idTemplate: number, operator: string) {
    this.editableTemplate = idTemplate;
    this.editableOperator = operator;
  }

  addOperator(idOperator: number) {
    this.templates?.forEach((element, index) => {
      if (index == this.editableTemplate) {
        element[2][idOperator] = this.printFtoSave;
      }
    });
    this.saveTemplates();
  }

  deleteOperator(idTemplate: number, idOperator: number) {
    this.templates?.forEach((element, index) => {
      if (index == idTemplate) {
        element[2][idOperator] = "";
      }
    });
    this.saveTemplates();
  }

  addCk() {
    this.submittedCk = true;

    if (this.isCkFormValid()) {
      this.scenario?.compositeKeys.push(this.newCk);
      this.saveScenario();
    }
  }

  isCkFormValid(): boolean {
    return this.newCk.length > 1;
  }

  addFd() {
    this.submittedFd = true;
    const words: string[] = [];
    if (this.isFdFormValid()) {
      words.push(
        (this.formFds.controls['fdAttr'] as FormControl).value.split(',')
      );
      this.newFd.push(this.newFdDependency!);
      this.scenario?.fds.push([this.newFd, words]);
      this.saveScenario();
    }
  }

  isFdFormValid(): boolean {
    return (
      this.newFd.length > 0 &&
      !this.formFds?.invalid &&
      this.newFdDependency != undefined
    );
  }

  addTemplate() {
    this.submittedTemplate = true;
    if (this.newTemplate) {
      try {
        this.http
          .get<string>(
            Constants.API_ENDPOINT +
              'scenario/get/templates/structure/' +
              this.newTemplate
          )
          .subscribe((val) => {
            let result: [string, string, string[], string] = <
              [string, string, string[], string]
            >JSON.parse(val);
            console.log('*** new template: ' + result[2]);
            this.templates?.push(result);
            this.expandedTemplate = this.templates?.length! - 1;
            this.submittedTemplate = false;
          });
      } catch (error) {
        console.log(error);
      }
    }
  }

  addAmbiguous() {
    this.submittedAmbiguous = true;
    if (this.isAmbiguousFormValid()) {
      if (!this.scenario?.ambiguousAttribute)
        this.scenario!.ambiguousAttribute = [];
      let label = (this.formAmbiguous.controls['ambiguousLabel'] as FormControl)
        .value;
      this.scenario!.ambiguousAttribute.push([
        this.newAttr1Ambiguous!,
        this.newAttr2Ambiguous!,
        label,
      ]);
      this.saveScenario();
    }
  }

  isAmbiguousFormValid(): boolean {
    return (
      this.newAttr1Ambiguous != undefined &&
      this.newAttr2Ambiguous != undefined &&
      !this.formAmbiguous?.invalid
    );
  }

  deleteCk(i: number) {
    this.scenario?.compositeKeys.forEach((element, index) => {
      if (index == i) this.scenario?.compositeKeys.splice(index, 1);
    });
    this.saveScenario();
  }

  editFd(i: number) {
    this.fdEditable = i;
  }

  saveFd(i: number) {
    this.scenario!.fds[i][1] = this.scenario!.fds[i][1].toString().split(',') 
    this.saveScenario();
  }

  deleteFd(i: number) {
    this.scenario?.fds.forEach((element, index) => {
      if (index == i) this.scenario?.fds.splice(index, 1);
    });
    this.saveScenario();
  }

  deleteTemplate(i: number) {
    this.templates?.forEach((element, index) => {
      if (index == i) this.templates?.splice(index, 1);
    });
    this.saveTemplates();
  }

  editAmbiguous(i: number) {
    this.ambiguousEditable = i;
  }

  saveAmbiguous(i: number) {
    this.saveScenario();
  }

  deleteAmbiguous(i: number) {
    this.scenario?.ambiguousAttribute.forEach((element, index) => {
      if (index == i) this.scenario?.ambiguousAttribute.splice(index, 1);
    });
    this.saveScenario();
  }

  saveScenario() {
    try {
      const formData = new FormData();
      formData.append('scenario', JSON.stringify(this.scenario));
      this.http
        .post<string>(
          Constants.API_ENDPOINT + 'scenario/save/' + this.scenarioName,
          formData
        )
        .subscribe((val) => {
          this.scenario = <Scenario>JSON.parse(val);
          this.newCk = new Array();
          this.submittedCk = false;
          this.fdEditable = -1;
          this.newFd = new Array();
          this.newFdDependency = undefined;
          this.formFds.controls['fdAttr'].reset();
          this.submittedFd = false;
          this.ambiguousEditable = -1;
          this.newAttr1Ambiguous = undefined;
          this.newAttr2Ambiguous = undefined;
          this.formAmbiguous.controls['ambiguousLabel'].reset();
          this.submittedAmbiguous = false;
        });
    } catch (error) {
      console.log(error);
    }
  }

  saveTemplates() {
    try {
      const formData = new FormData();
      formData.append('templates', JSON.stringify(this.templates));
      this.http
        .post<string>(
          Constants.API_ENDPOINT +
            'scenario/save/templates/' +
            this.scenarioName,
          formData
        )
        .subscribe((val) => {
          this.templates = <Array<[string, string, string[], string]>>(
            JSON.parse(val)
          );
          this.expandedTemplate = -1;
          this.submittedTemplate = false;
          this.printFtoSave = "";
        });
    } catch (error) {
      console.log(error);
    }
  }

  // isTemplateFormValid(t: Template): boolean {
  //   return 
  // }

  //*--- Prism methods ---*

  updateSqlText(index: number) {
    let test: string = '';
    let contents = this.highlightingContents!.toArray();
    if (contents[index]) {
      // Update code
      contents[index].nativeElement.textContent = this.templates![index][0];

      // Syntax Highlight
      Prism.highlightElement(contents[index].nativeElement);
    }
  }
}
