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
    }).compileComponents();
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
    component.gameModeString = component.pva;
    component.changeGameMode();

    expect(component.gameModeString).toEqual(component.pvp);
    component.changeGameMode();

    expect(component.gameModeString).toEqual(component.pva);
  });

  it('changeAiDifficulty should modify AI difficulty', () => {
    component.aiDifficultyString = component.aiEasy;
    component.changeAiDifficulty();

    expect(component.aiDifficultyString).toEqual(component.aiMedium);
    component.changeAiDifficulty();

    expect(component.aiDifficultyString).toEqual(component.aiHard);
    component.changeAiDifficulty();
    
    expect(component.aiDifficultyString).toEqual(component.aiEasy);
  });
});

