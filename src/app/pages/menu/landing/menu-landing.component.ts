import { Component, OnInit } from '@angular/core';
const { version: appVersion } = require('../../../../../package.json');
import { AppConfig } from '../../../../environments/environment';
import { ElectronService } from '../../../core/services';
import { SoundEndAction, SoundType } from '../../../shared/components/sound-controller/interfaces/sound-controller.interface';
import { SoundService } from '../../../shared/components/sound-controller/services/sound.service';

@Component({
  selector: 'app-menu-landing',
  templateUrl: './menu-landing.component.html',
  styleUrls: ['../menu-common.scss']
})
export class MenuLandingComponent implements OnInit {
  public readonly appVersion: string = appVersion;
  public readonly appConfig = AppConfig;

  constructor(
    private readonly electronService: ElectronService,
    private readonly soundService: SoundService
  ) {}

  ngOnInit(): void {
    this.soundService.add('/assets/sound/main.mp3', SoundEndAction.LOOP, SoundType.MUSIC);
  }

  quitElectronHost(): void {
    if (this.appConfig.production) {
      this.electronService.isElectron ? this.electronService.remote.getCurrentWindow().close() : console.warn('Electron not detected, close() not executed.');
    } else {
      this.electronService.isElectron ? alert('Electron running in DEV, close() will not be executed.') : console.warn('Electron not detected, close() not executed.');
    }
  }

}
