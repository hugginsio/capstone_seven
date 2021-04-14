import { Directive, HostListener, Input } from '@angular/core';
import { SoundEndAction, SoundType } from '../../components/sound-controller/interfaces/sound-controller.interface';
import { SoundService } from '../../components/sound-controller/services/sound.service';

@Directive({
  selector: '[boombox]'
})
export class BoomboxDirective {

  @Input() boombox: string;

  constructor(
    private readonly soundService: SoundService
  ) {}

  @HostListener('click')
  onClick(): void {
    this.soundService.add(`/assets/sound/fx/${this.boombox}.wav`, SoundEndAction.DIE, SoundType.FX);
  }
}
