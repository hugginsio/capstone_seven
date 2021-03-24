import { Injectable } from '@angular/core';
import { Component, Inject, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { SnackbarService } from '../../../../shared/components/snackbar/services/snackbar.service';
import { ManagerService } from './../../services/gamecore/manager.service';
import { LocalStorageService } from '../../../../shared/services/local-storage/local-storage.service';



@Injectable({
  providedIn: 'root'
})
export class GuidedTutorialService {

  public humanPlayer: string;

  constructor(
    public readonly gameManager: ManagerService,
    private readonly storageService: LocalStorageService,
    private readonly snackbarService: SnackbarService
  ) { 
    this.humanPlayer = this.storageService.fetch('firstplayer');
  }

  startTutorial():void {
    this.snackbarService.add({message: 'this is a test'});
  }
}
