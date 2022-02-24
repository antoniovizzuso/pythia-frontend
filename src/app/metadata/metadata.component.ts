import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-metadata',
  templateUrl: './metadata.component.html',
  styleUrls: ['./metadata.component.css']
})
export class MetadataComponent implements OnInit {

  @Input() headers: string[] | undefined;
  @Input() metadata: [Array<string>, Array<string>, Array<string>];

  get primaryKeys(): Array<string> {
    return this.metadata[0];
  }

  get compositeKeys(): Array<string> {
    return this.metadata[1];
  }

  get functionalDependencies(): Array<string> {
    return this.metadata[2];
  }

  constructor() { }

  ngOnInit(): void {
  }

}
