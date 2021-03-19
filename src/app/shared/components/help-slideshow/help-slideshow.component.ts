import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-help-slideshow',
  templateUrl: './help-slideshow.component.html',
  styleUrls: ['./help-slideshow.component.scss']
})
export class HelpSlideshowComponent {

  private currentSlide = 1;

  @Input() slidesToShow = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

  constructor() { }

  decrementSlides(): void {
    this.currentSlide--;
  }

  incrementSlides(): void {
    this.currentSlide++;
  }
}
