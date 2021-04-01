import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoundControllerComponent } from './sound-controller.component';

describe('SoundControllerComponent', () => {
  let component: SoundControllerComponent;
  let fixture: ComponentFixture<SoundControllerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SoundControllerComponent ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SoundControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
