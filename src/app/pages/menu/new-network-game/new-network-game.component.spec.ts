import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewNetworkGameComponent } from './new-network-game.component';

describe('NewNetworkGameComponent', () => {
  let component: NewNetworkGameComponent;
  let fixture: ComponentFixture<NewNetworkGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewNetworkGameComponent ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewNetworkGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
