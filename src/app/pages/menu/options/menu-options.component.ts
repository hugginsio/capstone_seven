import { Component } from '@angular/core';
import { SoundService } from '../../../shared/components/sound-controller/services/sound.service';
import { LocalStorageService } from '../../../shared/services/local-storage/local-storage.service';

@Component({
  selector: 'app-menu-options',
  templateUrl: './menu-options.component.html',
  styleUrls: ['../menu-common.scss']
})
export class MenuOptionsComponent {
  public masterVolume: number;
  public prevContext: string;

  constructor(
    private readonly storageService: LocalStorageService,
    private readonly soundService: SoundService
  ) {
    this.prevContext = this.storageService.getContext();
    this.refreshFromStorage();
  }

  refreshFromStorage(): void {
    this.storageService.setContext('sound');
    this.masterVolume = +this.storageService.fetch('volume');
    this.storageService.setContext(this.prevContext);
  }

  volumeChanged(): void {
    console.log('Volume changed');
    this.storageService.setContext('sound');
    this.storageService.update('volume', this.masterVolume.toString());
    this.storageService.setContext(this.prevContext);

    this.soundService.update();
  }
}
                