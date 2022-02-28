import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadScenarioComponent } from './load-scenario.component';

describe('LoadScenarioComponent', () => {
  let component: LoadScenarioComponent;
  let fixture: ComponentFixture<LoadScenarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadScenarioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadScenarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
