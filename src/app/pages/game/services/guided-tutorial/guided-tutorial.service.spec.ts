import { TestBed } from "@angular/core/testing";

import { GuidedTutorialService } from "./guided-tutorial.service";

describe("GuidedTutorialService", () => {
  let service: GuidedTutorialService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GuidedTutorialService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
