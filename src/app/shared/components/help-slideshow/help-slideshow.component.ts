import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-help-slideshow',
  templateUrl: './help-slideshow.component.html',
  styleUrls: ['./help-slideshow.component.scss']
})
export class HelpSlideshowComponent {

  public currentSlide = 1;
  public maxSlides = 13;

  @Input() slidesToShow = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

  constructor() { }

  decrementSlides(): void {
    if (this.currentSlide > 1)
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
    if (btn === 'prev' && this.currentSlide === 1) {
      return 'disabled';
    }
    else if (btn === 'next' && this.currentSlide === this.maxSlides) {
      return 'disabled';
    }
    else {
      return '';
    }
  }
}
