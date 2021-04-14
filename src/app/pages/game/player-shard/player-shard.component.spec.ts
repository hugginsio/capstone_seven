import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PlayerShardComponent } from "./player-shard.component";

describe("PlayerShardComponent", () => {
  let component: PlayerShardComponent;
  let fixture: ComponentFixture<PlayerShardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlayerShardComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerShardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
