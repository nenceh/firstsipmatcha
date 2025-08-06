import { Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuStore } from '../../../stores/menu.store';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'ul.more-items-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './related_items.html',
  styleUrl: './related_items.scss',
})
export class RelatedItems {
  itemId = input.required<string>();
  tagName = input.required<string>();

  relatedItems = inject(MenuStore);

  ngOnInit(): void{
    this.relatedItems.searchTag(this.tagName());
    
  }
}
