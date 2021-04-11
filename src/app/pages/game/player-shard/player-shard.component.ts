import { Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Player } from '../classes/gamecore/game.class.Player';
import { CommPackage } from '../interfaces/game.interface';
import { CommCode } from '../interfaces/game.enum';
import { PlayerType } from '../enums/game.enums';
import { GuidedTutorialService } from '../services/guided-tutorial/guided-tutorial.service';
import { LocalStorageService } from '../../../shared/services/local-storage/local-storage.service';


@Component({
  selector: 'app-player-shard',
  templateUrl: './player-shard.component.html',
  styleUrls: ['./player-shard.component.scss']
})
export class PlayerShardComponent implements OnInit {

  @Input() playerDetail: Player;
  @Input() playerName: string;
  @Input() currentPlayer: boolean;
  @Input() actionSubject: Subject<CommPackage>;
  @Input() isConnected: boolean;

  constructor(
    public guidedTutorial: GuidedTutorialService,
    private readonly storageService: LocalStorageService
    ) { }

  ngOnInit(): void { }

  getDynamicClass(btn: string): string {
    let btnClass = "";
    console.log("playerShard Dynamic class: " + btn);
    if(this.playerDetail?.type !== PlayerType.HUMAN)
    {
      btnClass = "button-hidden";
    }
    else if (this.storageService.fetch('guided-tutorial') === "true" && btn === this.guidedTutorial.playerShardBtn) 
    {
      btnClass = "selected-GT";
    }
    else if(!this.currentPlayer)
    {
      btnClass = "button-disabled";
    }
    else if(this.currentPlayer)
    {
      btnClass = "button-std";
    }
    return btnClass;
    //return `${this.currentPlayer ? 'button-std' : 'button-disabled'} ${this.playerDetail?.type !== PlayerType.HUMAN ? 'button-hidden' : ''}`;
  }

  getEndTurnClass(): string {
    let btnClass = "";
    if(this.playerDetail?.type !== PlayerType.HUMAN)
    {
      btnClass = "button-hidden";
    }
    else if(!this.currentPlayer || !this.isConnected)
    {
      btnClass = "button-disabled";
    }
    else if(this.currentPlayer)
    {
      btnClass = "button-std";
    }
    return btnClass;
  }

  generateMessage(action: CommCode): CommPackage {
    return {
      code: action,
      player: this.playerDetail 
    };
  }

  triggerTrading(): void {
    this.actionSubject.next(this.generateMessage(CommCode.IS_TRADING));
  }

  triggerEndTurn(): void {
    this.actionSubject.next(this.generateMessage(CommCode.END_TURN));
  }

  triggerUndo(): void {
    this.actionSubject.next(this.generateMessage(CommCode.UNDO));
  }
}
