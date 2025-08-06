import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainNav } from '../main_nav/main_nav';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'div.footer-container',
  imports: [CommonModule, MainNav, RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  classname="footer-link";
}
