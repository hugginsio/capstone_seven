import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu-help',
  templateUrl: './menu-help.component.html',
  styleUrls: ['../menu-common.scss', './help.scss'],
})
export class MenuHelpComponent implements OnInit {

  //public slideIndex: number;

  constructor() { 
    //this.slideIndex = 1;
  }

  ngOnInit(): void {
  }

  //https://www.w3schools.com/howto/howto_js_slideshow.asp
  /*plusSlides(n: number):void {
    showSlides(slideIndex += n);
  }

  currentSlide (n: number):void {
    showSlides(slideIndex = n);
  }

  showSlides(n: number):void {
    let i;
    let slides = document.getElementsByClassName("slide");
    if(n>slides.length) { this.slideIndex = 1 }
    if (n < 1) { this.slideIndex = slides.length }
    for (i = 0; i < slides.length, i++)
    {
      slides[i].isVisible = false;
    }
  }*/
}
