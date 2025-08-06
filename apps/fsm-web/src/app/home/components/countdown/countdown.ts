import { Component, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'div.countdown-timer',
  imports: [CommonModule],
  templateUrl: './countdown.html',
  styleUrl: './countdown.scss',
})
export class Countdown {
  targetDate = signal<Date>(new Date());
  targetDateInput = input.required<Date>();
  timeUntil = signal<number>(0);

  days = signal(0);
  hours = signal(0);
  minutes = signal(0);
  seconds = signal(0);

  constructor(){}

  ngOnInit(){
    this.targetDate.set(new Date(this.targetDateInput().toLocaleString('en-US', { timeZone: 'America/New_York' })));

    this.timeUntil.set(this.targetDate().getTime());

    (async() => {
      this.interval();
    })();
  }

  interval(){
    const distance = this.timeUntil() - new Date().getTime();
    const temp = setTimeout(this.interval, 1000);

    if(distance < 0){
      clearTimeout(temp);
      this.days.set(0);
      this.hours.set(0);
      this.minutes.set(0);
      this.seconds.set(0);

      return;
    } else{
      this.days.set(Math.floor(distance / (1000 * 60 * 60 * 24)));
      this.hours.set(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
      this.minutes.set(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
      this.seconds.set(Math.floor((distance % (1000 * 60)) / 1000));
    }
  }
}
