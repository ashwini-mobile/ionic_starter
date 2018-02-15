import { Component, ElementRef, NgZone, Host, Directive, Input } from '@angular/core';
//slick carousel
import * as $ from 'jquery';
import 'slick-carousel/slick/slick';

@Component({
  selector: 'slick-carousel',
  template: `<ng-content></ng-content>`
})
export class SlickCarouselComponent {
  @Input() typeSlick: string;

  constructor(private el: ElementRef, private zone: NgZone) {
  }

  $carousel: any;
  initialized: any = false;

  initCarousel(): void {
    if (this.typeSlick === 'wide'){
      this.zone.runOutsideAngular(() => {
        this.$carousel = $(this.el.nativeElement).slick({
          speed: 300,
          centerMode: true,
          centerPadding: 0,
          variableWidth: true,
          slidesToShow: 1,
          arrows: false,
          dot: false
        });
      });
    }else{
      this.zone.runOutsideAngular(() => {
        this.$carousel = $(this.el.nativeElement).slick({
          infinite: true,
          speed: 300,
          arrows: false,
          dot: false,
          slidesToShow: 6,
          slidesToScroll: 1,
          responsive: [
            {
              breakpoint: 330,
              settings: {
                slidesToShow: 5
              }
            }
          ]

        });
      });
    }
    this.initialized = true;
  }

  slides: any = [];

  addSlide(slide: any): void {
    !this.initialized && this.initCarousel();
    this.slides.push(slide);
    this.$carousel.slick('slickAdd', slide.el.nativeElement);
  }

  removeSlide(slide: any): void {
    const idx: any = this.slides.indexOf(slide);
    this.$carousel.slick('slickRemove', idx);
    this.slides = this.slides.filter(s => s !== slide);
  }
}


@Directive({
  selector: '[slick-carousel-item]',
})
export class SlickCarouselItem {
  constructor(private el: ElementRef, @Host() private carousel: SlickCarouselComponent) {
  }
  ngAfterViewInit(): void {
    this.carousel.addSlide(this);
  }
  ngOnDestroy(): void {
    this.carousel.removeSlide(this);
  }
}
