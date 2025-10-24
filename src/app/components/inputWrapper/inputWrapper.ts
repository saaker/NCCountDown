import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-input-wrapper',
  styleUrl: './inputWrapper.scss',
  template: `
    <span class="label">{{ label }}</span>
    <ng-content></ng-content>
  `,
})
export class InputWrapper {
  @Input() label = '';
}
