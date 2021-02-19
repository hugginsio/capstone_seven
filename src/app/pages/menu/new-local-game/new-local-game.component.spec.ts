import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewLocalGameComponent } from './new-local-game.component';

describe('NewLocalGameComponent', () => {
  let component: NewLocalGameComponent;
  let fixture: ComponentFixture<NewLocalGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewLocalGameComponent ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewLocalGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

