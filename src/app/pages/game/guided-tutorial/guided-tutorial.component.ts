import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { LocalStorageService } from '../../../shared/services/local-storage/local-storage.service';
import { Player } from '../classes/gamecore/game.class.Player';
//import { GuidedTutorialInterface } from '../interfaces/game.enum';
import { ClickEvent, GuidedTutorialInterface } from '../interfaces/game.interface';
import { ManagerService } from '../services/gamecore/manager.service';
import { TradingModel } from '../models/trading.model';
import { SnackbarService } from '../../../shared/components/snackbar/services/snackbar.service';
import { GuidedTutorialService } from '../services/guided-tutorial/guided-tutorial.service';

@Component({
  selector: 'app-guided-tutorial',
  templateUrl: './guided-tutorial.component.html',
  styleUrls: ['./guided-tutorial.component.scss']
})
export class GuidedTutorialComponent implements OnInit {

  //public readonly GT = new Subject<GuidedTutorialInterface>();

  constructor(
    @Inject(DOCUMENT) private document: Document,
    public readonly gameManager: ManagerService,
    private readonly storageService: LocalStorageService,
    private readonly snackbarService: SnackbarService,
    private readonly GTService: GuidedTutorialService
  ){ 
    this.storageService.setContext('game');
  }

  ngOnInit(): void { }

  clickBtn(event: ClickEvent): void {
    const button = event.target.id;
    const step = this.GTService.getstepNum();
    if (button === 'Back' && step > 0)
    {
      // can't go back moves, only instructions
      this.GTService.decrementStepNum();
      this.GTService.tutorialManager();
    }
    // how many steps we have
    // variable depending on who goes first???
    else if (button === 'Next' && step < 5){
      // check if need to block move next button bc game nneds to be played 
      this.GTService.incrementStepNum();
      this.GTService.tutorialManager();
    }
  }
        
}
