import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';

@Component({
  selector: 'app-sound-controller',
  templateUrl: './sound-controller.component.html'
})
export class SoundControllerComponent implements OnInit {

  constructor(
    private readonly storageService: LocalStorageService
  ){}

  ngOnInit(): void {
    console.log('Sound controller loaded.');
    this.storageService.setContext('sound');
  }

  checkForUpdates(): void {
    // check localstorage
  }
}
