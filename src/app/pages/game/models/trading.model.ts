import { ResourceMap } from "../interfaces/game.interface";
import { LocalStorageService } from '../../../shared/services/local-storage/local-storage.service';
import { GuidedTutorialService } from '../services/guided-tutorial/guided-tutorial.service';
import * as _ from 'lodash';

export class TradingModel {
  redResources: number;
  greenResources: number;
  blueResources: number;
  yellowResources: number;

  selectedResource: number;
  currentResources: ResourceMap;
  resourceMap: ResourceMap;

  constructor(
    private readonly storageService: LocalStorageService,
    public guidedTutorial: GuidedTutorialService
  ) {
    this.redResources = 0;
    this.greenResources = 0;
    this.blueResources = 0;
    this.yellowResources = 0;

    this.selectedResource = 0;
  }

  increment(num: number): void {
    if (this.redResources + this.greenResources + this.blueResources + this.yellowResources < 3) {
      if(this.storageService.fetch('guided-tutorial') === "true" && (num === 2 || num === 3)){
        return;
      }
      switch (num) {
        case 1:
          if(this.storageService.fetch('guided-tutorial') === "true") {
            if(!this.guidedTutorial.moveManager('1'))
            {
              return;
            }
          }

          if (this.currentResources.red === 0 && this.redResources === this.resourceMap.red) {
            this.redResources = 0;
            this.currentResources.red = this.resourceMap.red;
          } else {
            this.redResources++;
            this.currentResources.red--;
          }

          break;

        case 2:
          if (this.currentResources.green === 0 && this.greenResources === this.resourceMap.green) {
            this.greenResources = 0;
            this.currentResources.green = this.resourceMap.green;
          } else {
            this.greenResources++;
            this.currentResources.green--;
          }

          break;

        case 3:
          if (this.currentResources.blue === 0 && this.blueResources === this.resourceMap.blue) {
            this.blueResources = 0;
            this.currentResources.blue = this.resourceMap.blue;
          } else {
            this.blueResources++;
            this.currentResources.blue--;
          }

          break;

        case 4:
          if(this.storageService.fetch('guided-tutorial') === "true") {
            if(!this.guidedTutorial.moveManager('4'))
            {
              return;
            }
          }

          if (this.currentResources.yellow === 0 && this.yellowResources === this.resourceMap.yellow) {
            this.yellowResources = 0;
            this.currentResources.yellow = this.resourceMap.yellow;
          } else {
            this.yellowResources++;
            this.currentResources.yellow--;
          }
          
          break;
      }
    } else {
      console.warn('three resources already selected');
      switch (num) {
        case 1:
          this.redResources = 0;
          this.currentResources.red == this.resourceMap.red;

          break;

        case 2:
          this.greenResources = 0;
          this.currentResources.green == this.resourceMap.green;

          break;

        case 3:
          this.blueResources = 0;
          this.currentResources.blue == this.resourceMap.blue;

          break;

        case 4:
          this.yellowResources = 0;
          this.currentResources.yellow == this.resourceMap.yellow;

          break;
      }
    }
  }

  select(num: number): void {
    if (this.redResources + this.blueResources + this.greenResources + this.yellowResources === 3) {

      if(this.storageService.fetch('guided-tutorial') === "true"){
        let stringToSend = 'none';
        switch(num){
          case 1: stringToSend = 'red';
            break;
          case 2: stringToSend = 'green';
            break;
          case 3: stringToSend = 'blue';
            break;
          case 4: stringToSend = 'yellow';
        }
        if(!this.guidedTutorial.moveManager(stringToSend))
        {
          return;
        }

      }

      let resourceVariable = 1;
      switch(num) {
        case 1: // red
          resourceVariable = this.redResources;
          break;
        case 2: // green
          resourceVariable = this.greenResources;
          break;
        case 3: // blue
          resourceVariable = this.blueResources;
          break;
        case 4: // yellow
          resourceVariable = this.yellowResources;
          break;
      }

      if (resourceVariable === 0)
      {
        this.selectedResource = num;
      }
      else {
        this.selectedResource = 0;

      }
    }
  }

  dynamicClass(num: number): string {
    if(this.storageService.fetch('guided-tutorial') === "true" && num === 44) {
      return 'selected-GT';
    }
    if (this.selectedResource !== num) {
      let gemToSelect = 1;
      switch(num) {
        case 1: // red
          gemToSelect = this.redResources;
          break;
        case 2: // green
          gemToSelect = this.greenResources;
          break;
        case 3: // blue
          gemToSelect = this.blueResources;
          break;
        case 4: // yellow
          gemToSelect = this.yellowResources;
          break;
        case 44: // for guided tutorial first highlight
          gemToSelect = 0;
          break;
      }
      if(gemToSelect > 0) {
        return 'disabled';
      }
    }

    if (this.selectedResource === num) {
      switch(num){
        case 1: return 'selected-red';
        case 2: return 'selected-green';
        case 3: return 'selected-blue';
        case 4: return 'selected-yellow';
        default: return 'selected';
      }
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
    this.resourceMap = _.cloneDeep(resources);
  }

  reset(): void {
    this.redResources = 0;
    this.greenResources = 0;
    this.blueResources = 0;
    this.yellowResources = 0;
    this.selectedResource = 0;
  }
}