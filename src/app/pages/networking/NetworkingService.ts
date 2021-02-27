import { GameClient } from "./GameClient";
import { MatchmakingClient } from "./MatchmakingClient";

let matchmakingService = new MatchmakingClient();
let gameService = new GameClient();

function hostGame() 
{
    gameService.createTCPServer();
    matchmakingService.hostGame();
} 

function joinGame(serverIP:string)
{
    gameService.connectTCPserver(serverIP);
}

//*********************** Matchmaking Events ***********************

matchmakingService.gameFound = (msg:string, oppAddress:string) => {
    console.log("Service Found Game");
    //Tell UI about game
}

//************************** Game Events ***************************

gameService.gameJoined = (msg:string) => {
    console.log(msg);
    //Tell UI/Game Core we joined a game
}