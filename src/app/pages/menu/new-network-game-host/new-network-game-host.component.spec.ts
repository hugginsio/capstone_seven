import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewNetworkGameHostComponent } from './new-network-game-host.component';

describe('NewNetworkGameHostComponent', () => {
  let component: NewNetworkGameHostComponent;
  let fixture: ComponentFixture<NewNetworkGameHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewNetworkGameHostComponent ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewNetworkGameHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
