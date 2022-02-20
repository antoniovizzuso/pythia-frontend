import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompositeKeysComponent } from './composite-keys.component';

describe('CompositeKeysComponent', () => {
  let component: CompositeKeysComponent;
  let fixture: ComponentFixture<CompositeKeysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompositeKeysComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompositeKeysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
