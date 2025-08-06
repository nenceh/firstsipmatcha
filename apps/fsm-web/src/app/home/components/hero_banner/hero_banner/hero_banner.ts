import { Component,
  ElementRef,
  signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SlideCountdown } from '../../slide_countdown/slide_countdown';

@Component({
  selector: 'div.landing-container#hero',
  imports: [
    CommonModule,
    SlideCountdown
  ],
  templateUrl: './hero_banner.html',
  styleUrl: './hero_banner.scss',
})

export class HeroBanner {
  readonly timeoutDuration: number = 10000;
  @ViewChild('slideRef', {read: ElementRef}) slideRef!: ElementRef;
  list = signal([
    {
      collab: false,
      targetDate: new Date("2025-07-19 09:00:00"),
      endDate: new Date("2025-07-19 13:00:00"),
      title1: "Vendoring biweekly at",
      title2: "JUNCTION FARMERS MARKET",
      locationAddress: "Baird Park, 275 Keele St.",
      locationTag: "@junctionmarket",
      displayTimer: true,
    }
  ]);

  cur = 0;
  bwd = 0;
  fwd = 0;

  curIdx = signal(0);
  bwdIdx = signal(-1);
  fwdIdx = signal(1);

  slideHeight = signal(0);

  direction = signal(1);

  canAnimate = signal(false);

  disable = signal(false);

  interval() {
    this.direction.set(1);
    this.slideConfig(1);
  }

  slideConfig(x: number){
    setTimeout(() => this.canAnimate.set(true), 100);
  }
}