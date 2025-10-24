import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-row-wrapper',
  styleUrl: './rowWrapper.scss',
  template: `<div [style.flex-direction]="isLandscape ? 'row' : 'column'">
    <ng-content></ng-content>
  </div>`,
})
export class RowWrapper {
  @Input() isLandscape?: boolean = true;
}
