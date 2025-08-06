import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainNav } from '../main_nav/main_nav';

@Component({
  selector: 'div.modal-container',
  imports: [CommonModule, MainNav],
  templateUrl: './modal_nav.html',
  styleUrl: './modal_nav.scss',
})
export class ModalNav {
  classname: string = "btn-menuitem";
  menuOpen = input.required();
}
