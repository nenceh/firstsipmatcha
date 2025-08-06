import { Component } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { DropdownToggle } from './components/dropdown_toggle/dropdown_toggle/dropdown_toggle';
import { PageTitle } from '../components/page_layout/page_title/page_title';
import { PageBody } from '../components/page_layout/page_body/page_body';
import { Figure } from '../components/figure/figure';
import * as jsonData from '../../database/aboutpage.json';

@Component({
  selector: 'app-about',
  imports: [CommonModule, NgOptimizedImage, DropdownToggle, Figure, PageTitle, PageBody],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About {
  about_info: any;
  toggleList: boolean[] = [false, false, false];

  ngOnInit(): void {
    this.about_info = jsonData;
  }

  toggleBenefit(index: number){
    this.toggleList[index] = !this.toggleList[index];
  }
}