import { Component, OnInit } from '@angular/core';
const { version: appVersion } = require('../../../../../package.json');
import { AppConfig } from '../../../../environments/environment';
import { ElectronService } from '../../../core/services';

@Component({
  selector: 'app-menu-landing',
  templateUrl: './menu-landing.component.html',
  styleUrls: ['../menu-common.scss']
})
export class MenuLandingComponent implements OnInit {
  public readonly appVersion: string = appVersion;
  public readonly appConfig = AppConfig;

  constructor(
    private readonly electronService: ElectronService
  ) { }

  ngOnInit(): void {}

  quitElectronHost(): void {
    if (this.appConfig.production) {
      this.electronService.isElectron ? this.electronService.remote.getCurrentWindow().close() : console.warn('Electron not detected, close() not executed.');
    } else {
      this.electronService.isElectron ? alert('Electron running in DEV, close() will not be executed.') : console.warn('Electron not detected, close() not executed.');
    }
  }

}
