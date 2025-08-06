import { Component, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Countdown } from '../countdown/countdown';

@Component({
  selector: 'div.slide',
  imports: [CommonModule, Countdown],
  templateUrl: './slide_countdown.html',
  styleUrl: './slide_countdown.scss',
})
export class SlideCountdown {
  targetDate = input.required<Date>();
  endDate = input.required<Date>();
  title1 = input.required<string>();
  title2 = input.required<string>();
  locationAddress = input.required<string>();
  locationTag = input.required<string>();
  displayTimer= input.required<boolean>();

  startTime: string = '';
  endTime: string = '';
  dayOfWeek = signal<string>('');
  month: string = '';
  date: number = 0;

  readonly DAYS: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  constructor(){}

  ngAfterViewInit(): void{
    this.dayOfWeek.set(this.DAYS[this.targetDate().getDay()]);
    this.month = this.targetDate().toLocaleString('default', { month: 'long' }).substr(0,3);
    this.date = this.targetDate().getDate();

    if (this.targetDate().getMinutes() == 0){
      this.startTime = this.targetDate().toLocaleTimeString('en-US', {hour: 'numeric'}).replace(' ', '');
    } else{
      this.startTime = this.targetDate().toLocaleTimeString('en-US', {hour: 'numeric', minute:'numeric'}).replace(' ', '');
    }

    if (this.endDate().getMinutes() == 0){
      this.endTime = this.endDate().toLocaleTimeString('en-US', {hour: 'numeric'}).replace(' ', '');
    } else{
      this.endTime = this.endDate().toLocaleTimeString('en-US', {hour: 'numeric', minute:'numeric'}).replace(' ', '');
    }
  }
}
