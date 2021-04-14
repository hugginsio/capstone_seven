import { ComponentFixture, TestBed } from "@angular/core/testing";

import { MenuHelpComponent } from "./menu-help.component";

describe("MenuHelpComponent", () => {
  let component: MenuHelpComponent;
  let fixture: ComponentFixture<MenuHelpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MenuHelpComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
