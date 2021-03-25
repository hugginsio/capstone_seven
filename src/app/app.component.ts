import { Component } from '@angular/core';
import { ElectronService } from './core/services';
import { LocalStorageService } from './shared/services/local-storage/local-storage.service';
import { AppConfig } from '../environments/environment';
import { fadeAnimation } from '../animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [fadeAnimation]
})
export class AppComponent {
  public production: boolean;
  public reloadButton = true;

  constructor(
    private electronService: ElectronService,
    private storageService: LocalStorageService
  ) {
    this.production = AppConfig.production;
    
    console.log(`Production: ${this.production.toString()}`);
    console.log(`Environment: ${AppConfig.environment} / ${this.electronService.isElectron ? 'ELECTRON' : 'BROWSER'}`);

    // Game defaults
    // We set these in the app component so that they are always created on startup, regardless of page
    // If we initially navigate to the /game route, this will destroy any modified settings
    this.storageService.setContext('game');
    this.storageService.store('mode', 'pvp');
    this.storageService.store('ai-difficulty', 'easy');
    this.storageService.store('guided-tutorial', 'false');
    this.storageService.update('board-seed', '!random');
    this.storageService.update('firstplayer', 'one');
  }
}

if (typeof Worker === 'undefined') {
  alert('Error initializing web workers.');
}