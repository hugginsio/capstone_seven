import { AfterViewInit, Component, OnInit } from '@angular/core';
import { GameNetworkingService } from '../../networking/game-networking.service';
import { MatchmakingService } from '../../networking/matchmaking.service';
import { NetworkGameInfo } from './interfaces/new-network-game.interface';
import { NetworkGameSettings } from '../../networking/NetworkGameSettings';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../../shared/services/local-storage/local-storage.service';

@Component({
  selector: 'app-new-network-game',
  templateUrl: './new-network-game.component.html',
  styleUrls: ['../menu-common.scss']
})
export class NewNetworkGameComponent implements OnInit, AfterViewInit {
  private username: string;
  private list:any;
  private gamesList: Array<NetworkGameInfo>;
  private gameSettings: NetworkGameSettings;

  constructor(
    private readonly storageService: LocalStorageService,
    private readonly matchmakingService: MatchmakingService,
    private readonly networkingService: GameNetworkingService,
    private readonly routerService: Router
  ) {}

  ngAfterViewInit(): void {
    this.list = document.getElementById("gameList");
  }

  ngOnInit(): void {
    // instantiate class here
    this.gamesList = new Array<NetworkGameInfo>();
    this.matchmakingService.initialize(this.username);

    this.matchmakingService.listen('you-connected').subscribe(() => {
      console.log('You are connected to your UDP server.');
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

      //append to arrary
      if (!isDuplicate)
      {
        this.gamesList.push({
          host: oppUsername,
          address: oppAddress
        });
      }

    });

  }

  JoinGame(oppAddress:string): void {
    //get gameInfo from object clicked
    this.networkingService.connectTCPserver(oppAddress);

    this.networkingService.listen('lobby-joined').subscribe((gameInfo:any) => {
    });

    this.networkingService.listen('lobby-full').subscribe(() => {
      console.log('Lobby is full. Sucks bro');
    });
   
    this.networkingService.listen('get-game-settings').subscribe((settings: NetworkGameSettings) => {
      this.gameSettings = settings;
      this.storageService.update('isHost', 'false');
      this.storageService.update('oppAddress', oppAddress);
      console.log(this.gameSettings);
      this.routerService.navigate(['/game']);
    });

    this.networkingService.requestJoin();
  }

}
