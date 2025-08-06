import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroBanner } from './components/hero_banner/hero_banner/hero_banner';
import * as jsonData from '../../database/aboutpage.json';
import { Figure } from '../components/figure/figure';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink, HeroBanner, Figure],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  about_info: any;

  ngOnInit(): void {
    this.about_info = jsonData;
  }
}