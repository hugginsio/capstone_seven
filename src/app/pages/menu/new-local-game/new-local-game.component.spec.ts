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

  it('changeGameMode should flip game modes', () => {
    // Assumes vs AI is the default mode.
    component.changeGameMode();
    expect(component.gameModeString).toEqual(component.pvp);
    component.changeGameMode();
    expect(component.gameModeString).toEqual(component.pva);
  });

  it('changeAiDifficulty should flip AI difficulty', () => {
    // Assumes AI is set to easy by default.
    component.changeAiDifficulty();
    expect(component.aiDifficultyString).toEqual(component.aiMedium);
    component.changeAiDifficulty();
    expect(component.aiDifficultyString).toEqual(component.aiEasy);
  });
});

