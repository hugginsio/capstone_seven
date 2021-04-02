import { ResourceMap } from "../interfaces/game.interface";
import { LocalStorageService } from '../../../shared/services/local-storage/local-storage.service';


export class TradingModel {
  redResources: number;
  greenResources: number;
  blueResources: number;
  yellowResources: number;

  selectedResource: number;
  currentResources: ResourceMap;

  isTutorial: boolean;

  constructor(
    private readonly storageService: LocalStorageService
  ) {
    this.redResources = 0;
    this.greenResources = 0;
    this.blueResources = 0;
    this.yellowResources = 0;

    this.selectedResource = 0;

    if (this.storageService.fetch('guided-tutorial') === "false"){
      this.isTutorial = false;
    }
    else {
      this.isTutorial = true;
    }
  }

  increment(num: number): void {
    if (this.redResources + this.greenResources + this.blueResources + this.yellowResources < 3) {
      if(this.isTutorial && (num === 2 || num === 3)){
        return;
      }
      switch (num) {
        case 1:
          if(this.isTutorial && this.currentResources.red < 3) {
            return;
          }
          if (this.currentResources.red > 0) {
            this.redResources++;
            this.currentResources.red--;
          }

          break;

        case 2:
          if (this.currentResources.green > 0) {
            this.greenResources++;
            this.currentResources.green--;
          }

          break;

        case 3:
          if (this.currentResources.blue > 0) {
            this.blueResources++;
            this.currentResources.blue--;
          }

          break;

        case 4:
          if (this.currentResources.yellow > 0) {
            this.yellowResources++;
            this.currentResources.yellow--;
          }
          
          break;
      }
    } else {
      console.warn('three resources already selected');
    }
  }

  select(num: number): void {
    if (this.selectedResource != num) {
      this.selectedResource = num;
    } else {
      this.selectedResource = 0;
    }
  }

  dynamicClass(num: number): string {
    if (this.selectedResource === num) {
      return 'selected';
    } else {
      return '';
    }
  }

  getTradeMap(): ResourceMap {
    return {
      red: this.redResources,
      green: this.greenResources,
      blue: this.blueResources,
      yellow: this.yellowResources
    };
  }

  setCurrentResources(resources: ResourceMap): void {
    this.currentResources = resources;
  }

  reset(): void {
    this.redResources = 0;
    this.greenResources = 0;
    this.blueResources = 0;
    this.yellowResources = 0;
    this.selectedResource = 0;
  }
}