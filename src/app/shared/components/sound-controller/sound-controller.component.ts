import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';
import { SoundAction, SoundEndAction, SoundObject } from './interfaces/sound-controller.interface';
import { SoundService } from './services/sound.service';

@Component({
  selector: 'app-sound-controller',
  templateUrl: './sound-controller.component.html'
})
export class SoundControllerComponent {
  public sounds: Array<SoundObject> = [];
  private trackVolume: number;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private readonly storageService: LocalStorageService,
    private readonly soundService: SoundService
  ){
    this.trackVolume = 0.5;

    this.soundService.getSubject().subscribe(message => {
      this.checkForUpdates();
      if (message.action === SoundAction.ADD) {
        this.add(message.track, message.onEnd);
      } else if (message.action === SoundAction.REMOVE) {
        this.remove(message.id);
      } else if (message.action === SoundAction.CLEAR) {
        this.sounds.splice(0, this.sounds.length);
      } else if (message.action === SoundAction.UPDATE) {
        this.checkForUpdates();
        this.updateAllVolume();
      }
    });
  }

  private checkForUpdates(): void {
    const oldContext = this.storageService.getContext();
    this.storageService.setContext('sound');
    const newVolume = +this.storageService.fetch('volume') / 100;
    this.storageService.setContext(oldContext);
    this.trackVolume = newVolume;
  }

  updateAllVolume(): void {
    this.sounds.forEach(track => {
      const element = this.document.getElementById(track.id) as HTMLAudioElement;
      if (element) {
        element.volume = this.trackVolume;
      }
    });
  }

  private add(track: string, onTrackEnd: SoundEndAction): void {
    this.checkForUpdates();
    const newId = this.uuidv4();
    if (this.sounds.length !== 0 && !track.includes('main')) {
      this.sounds.push({
        track: track,
        id: newId,
        onEnd: onTrackEnd
      });
    } else if (this.sounds.length === 0) {
      this.sounds.push({
        track: track,
        id: newId,
        onEnd: onTrackEnd
      });
    }
  }

  private remove(id: string): void {
    const soundToRemove = this.sounds.find(object => object.id === id);
    if (soundToRemove) {
      this.sounds = this.sounds.filter(object => object.id !== id);
    }
  }

  // CC BY-SA 4.0
  // https://stackoverflow.com/a/2117523
  private uuidv4(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  trackShouldLoop(id: string): boolean {
    const track = this.sounds.find(object => object.id === id);
    if (track) {
      if (track.onEnd === SoundEndAction.LOOP) {
        return true;
      }
    }

    return false;
  }

  trackEnded(id: string): void {
    if (!this.trackShouldLoop(id)) {
      this.remove(id);
    } else {
      console.log(`Track ${id} ended, looping..,`);
    }
  }

  setVolume(id: string): void {
    const element = this.document.getElementById(id) as HTMLAudioElement;
    if (element) {
      element.volume = this.trackVolume;
    } else {
      console.warn(`Attempted to access track ${id} before it was created.`);
    }
  }

  forcePlay(id: string): void {
    const element = this.document.getElementById(id) as HTMLAudioElement;
    if (element) {
      if (element.paused) {
        element.play();
      }
    } else {
      console.warn(`Attempted to access track ${id} before it was created.`);
    }
  }
}
