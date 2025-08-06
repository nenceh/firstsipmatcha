import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'div.main-nav',
  imports: [CommonModule, RouterLink],
  templateUrl: './main_nav.html',
  styleUrl: './main_nav.scss',
})
export class MainNav {
  classname = input.required();
  modal = input();
  tiktok = input();
}