import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Figure } from '../../../components/figure/figure';

@Component({
  selector: 'div.slide',
  imports: [CommonModule, Figure],
  templateUrl: './slide_collab.html',
  styleUrl: './slide_collab.scss',
})
export class SlideCollab {}
