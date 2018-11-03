import {AfterViewInit, Directive, ElementRef, HostBinding, HostListener, Input, OnInit, Renderer2} from '@angular/core';
 
@Directive({
  selector: '[appDropdown]'
})
export class DropdownDirective implements AfterViewInit {
  dropdownMenu = false;
 
  @HostBinding('class.show') dropdownVisible = false;
 
  @HostListener('click')
  public onClick() {
    this.dropdownVisible = !this.dropdownVisible;
    if (this.dropdownVisible) {
      this.renderer.addClass(this.dropdownMenu, 'show');
    } else {
      this.renderer.removeClass(this.dropdownMenu, 'show');
    }
  }
 
  constructor(private elementRef: ElementRef, private renderer: Renderer2) {
  }
 
  ngAfterViewInit(): void {
    this.dropdownMenu = this.elementRef.nativeElement.querySelector('.dropdown-menu');
  }
 
}