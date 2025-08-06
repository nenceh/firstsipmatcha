import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'figure',
  imports: [CommonModule],
  templateUrl: './figure.html',
  styleUrl: './figure.scss',
})
export class Figure {
  classname = input();
  figcaption = input();
}