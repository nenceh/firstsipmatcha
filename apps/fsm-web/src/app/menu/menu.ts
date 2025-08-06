import { Component, inject } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { PageTitle } from '../components/page_layout/page_title/page_title';
import { PageBody } from '../components/page_layout/page_body/page_body';
import { RouterLink } from '@angular/router';
import { Figure } from '../components/figure/figure';
import { MenuService } from '../services/menuItem/menuItem.service';

@Component({
  selector: 'app-menu',
  imports: [CommonModule, Figure, PageTitle, PageBody, RouterLink, NgOptimizedImage],
  templateUrl: './menu.html',
  styleUrl: './menu.scss',
})
export class Menu {
  menuItems = inject(MenuService);

  constructor(){
    this.menuItems.loadItems();
  }
}