import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatSidenavContainer } from "@angular/material/sidenav";

@Component({
  selector: 'app-blank',
  templateUrl: './blank.component.html',
  styleUrls: [],
  imports: [RouterOutlet, CommonModule, MatSidenavContainer],
})
export class BlankComponent {
  private htmlElement!: HTMLHtmlElement;

  // options = this.settings.getOptions();

  constructor() {
    this.htmlElement = document.querySelector('html')!;
  }


}
