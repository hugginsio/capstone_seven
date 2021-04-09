import { Component, OnDestroy, OnInit } from '@angular/core';
import { GameNetworkingService } from '../../networking/game-networking.service';
import { MatchmakingService } from '../../networking/matchmaking.service';
import { NetworkGameInfo } from './interfaces/new-network-game.interface';
import { NetworkGameSettings } from '../../../../../backend/NetworkGameSettings';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../../shared/services/local-storage/local-storage.service';
import { SnackbarService } from '../../../shared/components/snackbar/services/snackbar.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-new-network-game',
  templateUrl: './new-network-game.component.html',
  styleUrls: ['../menu-common.scss']
})
export class NewNetworkGameComponent implements OnInit, OnDestroy {
  public username: string;
  public gamesList: Array<NetworkGameInfo>;
  public isEnteringName = false;
  public isServerError = false;
  public isConnected = false;
  private gameSettings: NetworkGameSettings;
  private listners: Array<Subscription>;

  constructor(
    private readonly storageService: LocalStorageService,
    private readonly matchmakingService: MatchmakingService,
    private readonly networkingService: GameNetworkingService,
    private readonly routerService: Router,
    private readonly snackbarService: SnackbarService
  ) {}
  ngOnDestroy(): void {
    this.listners.forEach(listener => listener.unsubscribe());
    if(this.networkingService.getSocketConnected())
    {
      this.networkingService.clearListners();
    }
  }

  ngOnInit(): void {
    // instantiate class here
    this.storageService.update('mode', 'net');
    this.username = this.storageService.fetch('username');
    this.gamesList = new Array<NetworkGameInfo>();
    this.listners = new Array<Subscription>();
    if(this.username === "ERR")
    {
      this.username = "";
      this.isEnteringName = true;
    }
    else
    {
      this.BeginMatchmaking();
    }
  }

  BeginMatchmaking(): void
  {
    this.matchmakingService.initialize(this.username);

    this.matchmakingService.listen('connect').subscribe(() => {
      this.isConnected = true;
    });

    this.matchmakingService.listen('connect_error').subscribe((err) => {
      this.matchmakingService.disconnectSocket();
      this.isServerError = true;
    });

    this.matchmakingService.listen('game-found').subscribe((gameInfo: any) => {
      const oppUsername:string = gameInfo.username;
      const oppAddress:string = gameInfo.oppAddress;
      //console.log(`${oppUsername} wants to play at ${oppAddress}`);

      let isDuplicate = false;
      this.gamesList.forEach(game => {
        if(gameInfo.oppAddress === game.address)
        {
          isDuplicate = true;
        }
      });

      //append to array
      if (!isDuplicate)
      {
        this.gamesList.push({
          host: oppUsername,
          address: oppAddress
        });
      }

    });
  }

  JoinGame(oppAddress:string, oppUsername:string): void {
    //get gameInfo from object clicked
    this.storageService.update('oppUsername', oppUsername);
    this.networkingService.connectTCPserver(oppAddress);

    this.listners.push(this.networkingService.listen('connect_error').subscribe((err) => {
      this.networkingService.disconnectSocket();
      this.snackbarService.add({message:"Failed to connect."});
      this.refresh();
    }));
    
    this.networkingService.listen('lobby-full').subscribe(() => {
      this.networkingService.disconnectSocket();
      this.snackbarService.add({message:"Lobby is full, please try again."});
      this.refresh();
    });

    this.networkingService.listen('game-cancelled').subscribe(() => {
      this.networkingService.disconnectSocket();
      this.snackbarService.add({message:"The host cancelled this game."});
      this.refresh();
    });
   
    this.networkingService.listen('get-game-settings').subscribe((settings: NetworkGameSettings) => {
      this.gameSettings = settings;
      this.storageService.update('isHost', 'false');
      this.storageService.update('oppAddress', oppAddress);
      this.storageService.update('board-seed', this.gameSettings.board);
      this.storageService.update('location', this.gameSettings.background);
      if (this.gameSettings.isHostFirst === true)
      {
        this.storageService.update('isHostFirst', 'true');
      }
      else
      {
        this.storageService.update('isHostFirst', 'false');
      }
      
      console.log(this.gameSettings);
      this.routerService.navigate(['/game']);
    });

    this.networkingService.requestJoin(this.username);
  }

  refresh(): void {
    this.gamesList = new Array<NetworkGameInfo>();
  }

  setUsername(): void {
    console.log(this.username);
    if(this.username === "")
    {
      this.snackbarService.add({message:"Please Enter a Username"});
    }
    else{
      this.isEnteringName = false;
      this.storageService.update('username', this.username);
      this.BeginMatchmaking();
    }
  }

  setButtons(): string {
    let btnClass = "";
    if(!this.isConnected)
    {
      btnClass = "menu-btn-disabled";
    }
    else
    {
      btnClass = "menu-btn";
    }
    return btnClass;
  }
}
