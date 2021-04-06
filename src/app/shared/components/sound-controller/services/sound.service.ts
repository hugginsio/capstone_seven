import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { SoundAction, SoundEndAction, SoundSubject } from '../interfaces/sound-controller.interface';

@Injectable({
  providedIn: 'root'
})
export class SoundService {
  private readonly soundService = new Subject<SoundSubject>();

  getSubject(): Observable<SoundSubject> {
    return this.soundService.asObservable();
  }

  add(track: string, onEnd: SoundEndAction): void {
    console.log(`Adding track ${track}`);
    this.soundService.next({
      action: SoundAction.ADD,
      track: track,
      onEnd: onEnd,
      id: ''
    });
  }

  remove(id: string): void {
    this.soundService.next({
      action: SoundAction.REMOVE,
      track: '',
      onEnd: SoundEndAction.DIE,
      id: id
    });
  }

  clear(): void {
    this.soundService.next({
      action: SoundAction.CLEAR,
      track: '',
      onEnd: SoundEndAction.DIE,
      id: ''
    });
  }

  update(): void {
    this.soundService.next({
      action: SoundAction.UPDATE,
      track: '',
      onEnd: SoundEndAction.DIE,
      id: ''
    });
  }
}
