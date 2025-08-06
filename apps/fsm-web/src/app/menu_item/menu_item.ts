import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PageBody } from '../components/page_layout/page_body/page_body';
import { Figure } from '../components/figure/figure';
import { RelatedItems } from './components/related_items/related_items';
import { MenuService } from '../services/menuItem/menuItem.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-menu-item',
  imports: [CommonModule, RouterLink, Figure,
    PageBody,
    RelatedItems,
  ],
  templateUrl: './menu_item.html',
  styleUrl: './menu_item.scss',
})
export class MenuItem {
  tagName!: string;
  itemId!: any;
  item = inject(MenuService);

  constructor(private titleService: Title, private route: ActivatedRoute) {
    this.route.paramMap.subscribe((params) => {
      this.itemId = params.get('itemId');
      this.item.getItem(this.itemId);
      
      const itemName = this.itemId.split('-').map((word: string) => {
        return word.charAt(0).toUpperCase() + word.slice(1)
      }).join(' ')
      this.titleService.setTitle(`${itemName} | First Sip Matcha Bar`);
    });
  }
}
