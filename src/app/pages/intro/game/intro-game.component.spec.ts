import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntroGameComponent } from './intro-game.component';

describe('IntroGameComponent', () => {
  let component: IntroGameComponent;
  let fixture: ComponentFixture<IntroGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntroGameComponent ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IntroGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
