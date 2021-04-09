import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { NewNetworkGameHostComponent } from './new-network-game-host.component';

xdescribe('NewNetworkGameHostComponent', () => {
  let component: NewNetworkGameHostComponent;
  let fixture: ComponentFixture<NewNetworkGameHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
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
