import { Component, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { ModalNav } from '../modal_nav/modal_nav';
import { MainNav } from "../main_nav/main_nav";

@Component({
  selector: 'div.header-container',
  imports: [CommonModule, RouterLink, MainNav, ModalNav],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  classname: string = "btn-menuitem";

  canAnimate: boolean = false;
  menuOpen: boolean = false;
  VW = 0;
  containerHeight = 0;

  @HostListener('window:resize')
  handleResize(){
    if(typeof window !== 'undefined'){
      this.VW = window.innerWidth;
    }

    if(this.VW >= 713){
      if(this.canAnimate) this.canAnimate = false;
      if(this.menuOpen) this.menuOpen = false;
    }
  }

  toggleMenu(){
    this.canAnimate = true;
    this.menuOpen = !this.menuOpen;
  }

  constructor(private containerRef: ElementRef, private router: Router){}

  ngOnInit() {
    this.handleResize();
    this.router.events.subscribe((event) => {
      if(event instanceof NavigationEnd && this.menuOpen){
        this.canAnimate = false;
        this.menuOpen = !this.menuOpen;
      }
    })
  }

  ngAfterContentInit(){
    const componentHeight = this.containerRef.nativeElement.offsetHeight;
    if(componentHeight !== this.containerHeight) this.containerHeight = componentHeight;
  }
}
