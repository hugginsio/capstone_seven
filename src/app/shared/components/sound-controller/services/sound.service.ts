import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { SoundAction, SoundEndAction, SoundSubject, SoundType } from "../interfaces/sound-controller.interface";

@Injectable({
  providedIn: "root",
})
export class SoundService {
  private readonly soundService = new Subject<SoundSubject>();

  getSubject(): Observable<SoundSubject> {
    return this.soundService.asObservable();
  }

  add(track: string, onEnd: SoundEndAction, type = SoundType.FX): void {
    console.log(`Adding track ${track}`);
    this.soundService.next({
      action: SoundAction.ADD,
      track: track,
      onEnd: onEnd,
      id: "",
      type: type,
    });
  }

  remove(id: string): void {
    this.soundService.next({
      action: SoundAction.REMOVE,
      track: "",
      onEnd: SoundEndAction.DIE,
      id: id,
      type: SoundType.FX,
    });
  }

  clear(): void {
    this.soundService.next({
      action: SoundAction.CLEAR,
      track: "",
      onEnd: SoundEndAction.DIE,
      id: "",
      type: SoundType.FX,
    });
  }

  update(): void {
    this.soundService.next({
      action: SoundAction.UPDATE,
      track: "",
      onEnd: SoundEndAction.DIE,
      id: "",
      type: SoundType.FX,
    });
  }
}
