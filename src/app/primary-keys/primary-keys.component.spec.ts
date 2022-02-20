import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimaryKeysComponent } from './primary-keys.component';

describe('PrimaryKeysComponent', () => {
  let component: PrimaryKeysComponent;
  let fixture: ComponentFixture<PrimaryKeysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrimaryKeysComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrimaryKeysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
