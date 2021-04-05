import { ResourceMap } from "../interfaces/game.interface";

export class TradingModel {
  redResources: number;
  greenResources: number;
  blueResources: number;
  yellowResources: number;

  selectedResource: number;
  currentResources: ResourceMap;

  constructor() {
    this.redResources = 0;
    this.greenResources = 0;
    this.blueResources = 0;
    this.yellowResources = 0;

    this.selectedResource = 0;
  }

  increment(num: number): void {
    if (this.redResources + this.greenResources + this.blueResources + this.yellowResources < 3) {
      switch (num) {
        case 1:
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
    }

    if (resourceVariable === 0)
    {
      this.selectedResource = num;
    }
    else {
      console.log("trying to trade for color you are trading");
    }
  }

  dynamicClass(num: number): string {
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
    }

    if(gemToSelect > 0) {
      return '';
    }

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