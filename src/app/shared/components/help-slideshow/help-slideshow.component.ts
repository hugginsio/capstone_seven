import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClickEvent } from '../../../pages/game/interfaces/game.interface';
import { LocalStorageService } from '../../../shared/services/local-storage/local-storage.service';


@Component({
  selector: 'app-help-slideshow',
  templateUrl: './help-slideshow.component.html',
  styleUrls: ['./help-slideshow.component.scss']
})
export class HelpSlideshowComponent {

  public currentSlide = 0;
  public maxSlides = 12;

  @Input() slidesToShow = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  @Input() inGame: string;

  constructor(
    private readonly storageService: LocalStorageService,
    private readonly routerService: Router
  ) { }

  decrementSlides(): void {
    if (this.currentSlide > 0)
    {
      this.currentSlide--;
    }
  }

  incrementSlides(): void {
    if (this.currentSlide < this.maxSlides)
    {
      this.currentSlide++;
    }
  }

  dynamicClass(btn: string): string {
    if (btn === 'prev' && this.currentSlide === 0) {
      return 'disabled';
    }
    else if (btn === 'next' && this.currentSlide === this.maxSlides) {
      return 'disabled';
    }
    else {
      return '';
    }
  }

  startGuidedTutorial(event: ClickEvent):void {
    //const button = event.target.id;

    this.storageService.update('guided-tutorial', 'true');

    this.routerService.navigate(['/game']);

  }

  tableOfContents(num: number):void{
    this.currentSlide = num;
  }

  tableClass(num: number):string {
    if(this.currentSlide === num) {
      return 'currentSlide';
    }
    return '';
  }
}
