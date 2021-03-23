import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuidedTutorialComponent } from './guided-tutorial.component';

describe('GuidedTutorialComponent', () => {
  let component: GuidedTutorialComponent;
  let fixture: ComponentFixture<GuidedTutorialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GuidedTutorialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GuidedTutorialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
