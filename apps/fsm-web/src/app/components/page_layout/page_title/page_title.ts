import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'div.page-item-container.title',
  imports: [CommonModule],
  templateUrl: './page_title.html',
  styleUrl: './page_title.scss',
})
export class PageTitle {
  titleText = input.required();
}
