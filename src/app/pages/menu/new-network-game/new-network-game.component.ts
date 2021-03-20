import { AfterViewInit, Component, OnInit } from '@angular/core';
import { GameNetworkingService } from '../../networking/game-networking.service';
import { MatchmakingService } from '../../networking/matchmaking.service';
import { NetworkGameInfo } from './interfaces/new-network-game.interface';
import { NetworkGameSettings } from '../../networking/NetworkGameSettings';

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
    private readonly matchmakingService: MatchmakingService,
    private readonly networkingService: GameNetworkingService
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

  HostGame(): void {
    //1. Lead to normal game creation screen
    //2. Create network game

    //3. Create game server
    const board = '';
    const isPlayer1 = true;
    this.networkingService.createTCPServer();
    this.initializeListeners();

    //4. Broadcast the game until someone joins
    this.matchmakingService.broadcastGame(); //Every 1000ms or so
  }

  JoinGame(oppAddress:string): void {
    //get gameInfo from object clicked
    console.log(oppAddress);
    this.networkingService.connectTCPserver(oppAddress);

    this.initializeListeners();
    this.networkingService.getNetGameSettings();
  }

  initializeListeners(): void {
    this.networkingService.listen('lobby-joined').subscribe((gameInfo:any) => {
    });

    this.networkingService.listen('lobby-full').subscribe(() => {
      console.log('Lobby is full. Sucks bro');
    });
   
    this.networkingService.listen('get-gameSettings').subscribe((settings: NetworkGameSettings) => {
      this.gameSettings = settings;
      console.log("Joined game");
      console.log(this.gameSettings);
    });
  }

  startJoinedGame(): void {
    //set game settings in storage
    
    //route to Game
  }

}
