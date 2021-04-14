import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";

import { HelpSlideshowComponent } from "./help-slideshow.component";

describe("HelpSlideshowComponent", () => {
  let component: HelpSlideshowComponent;
  let fixture: ComponentFixture<HelpSlideshowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [HelpSlideshowComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpSlideshowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
