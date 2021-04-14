import { Component } from "@angular/core";
import { SoundService } from "../../../shared/components/sound-controller/services/sound.service";
import { LocalStorageService } from "../../../shared/services/local-storage/local-storage.service";

@Component({
  selector: "app-menu-options",
  templateUrl: "./menu-options.component.html",
  styleUrls: ["../menu-common.scss"],
})
export class MenuOptionsComponent {
  public musicVolume: number;
  public fxVolume: number;
  public prevContext: string;

  constructor(private readonly storageService: LocalStorageService, private readonly soundService: SoundService) {
    this.prevContext = this.storageService.getContext();
    this.refreshFromStorage();
  }

  refreshFromStorage(): void {
    this.storageService.setContext("sound");
    this.musicVolume = +this.storageService.fetch("musicvolume");
    this.fxVolume = +this.storageService.fetch("fxvolume");
    this.storageService.setContext(this.prevContext);
  }

  volumeChanged(): void {
    console.log("volumechanged");
    this.storageService.setContext("sound");
    this.storageService.update("musicvolume", this.musicVolume.toString());
    this.storageService.update("fxvolume", this.fxVolume.toString());
    this.storageService.setContext(this.prevContext);

    this.soundService.update();
  }
}
