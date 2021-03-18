import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NewLocalGameComponent } from './new-local-game.component';

describe('NewLocalGameComponent', () => {
  let component: NewLocalGameComponent;
  let fixture: ComponentFixture<NewLocalGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ RouterTestingModule ],
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
    // Assumes PVP as default.
    component.changeGameMode();

    expect(component.gameModeString).toEqual(component.pva);
    component.changeGameMode();

    expect(component.gameModeString).toEqual(component.pvp);
  });

  it('changeAiDifficulty should flip AI difficulty', () => {
    // Assumes AI is set to easy by default.
    component.changeAiDifficulty();

    expect(component.aiDifficultyString).toEqual(component.aiMedium);
    component.changeAiDifficulty();

    expect(component.aiDifficultyString).toEqual(component.aiEasy);
  });
});

