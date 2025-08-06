import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'button.btn-secondary',
  imports: [CommonModule],
  templateUrl: './dropdown_toggle.html',
  styleUrl: './dropdown_toggle.scss',
})
export class DropdownToggle {
  itemIconClassName = input.required();
  itemLabel = input.required();
}
