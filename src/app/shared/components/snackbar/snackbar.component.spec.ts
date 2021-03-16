import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Snack } from './interfaces/snackbar.interface';
import { SnackbarService } from './services/snackbar.service';

import { SnackbarComponent } from './snackbar.component';

fdescribe('SnackbarComponent', () => {
  let component: SnackbarComponent;
  let fixture: ComponentFixture<SnackbarComponent>;
  let service: SnackbarService;
  const demoSnack: Snack  ={
    message: 'I live for pretzel day.'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SnackbarComponent ]
    }).compileComponents();

    service = TestBed.inject(SnackbarService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SnackbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initially be empty', () => {
    expect(component.snacks.length).toEqual(0);
  });

  it('should allow adding snacks', () => {
    service.add(demoSnack);
    expect(component.snacks.length).toEqual(1);
  });

  it('should only allow adding a set number of snacks', () => {
    for (let index = 0; index < 4; index++) {
      service.add(demoSnack);
    }

    expect(component.snacks.length).toEqual(3);
  });

  it('should allow clearing all snacks', () => {
    service.clear();
    expect(component.snacks.length).toEqual(0);
  });

  it('should allow removing a snack', () => {
    service.add(demoSnack);
    expect(component.snacks.length).toEqual(1);
    service.remove(component.snacks[0].id as string);
    expect(component.snacks.length).toEqual(0);
  });

  it('should do nothing when removing a snack that does not exist', () => {
    service.add(demoSnack);
    expect(component.snacks.length).toEqual(1);
    service.remove(demoSnack.message);
    expect(component.snacks.length).toEqual(1);
  });
});
