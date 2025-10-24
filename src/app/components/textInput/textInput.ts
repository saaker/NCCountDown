import { Component, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-text-input',
  styleUrls: ['./textInput.scss'],
  template: `<input
    name="countDownTextInput"
    type="text"
    [placeholder]="placeHolder"
    [value]="value"
    (input)="onInput($event)"
  />`,
})
export class TextInput implements OnInit {
  private storageKey = 'countdownText'; // Use same key as app component
  placeHolder = 'Type here...';
  value = '';
  @Output() valueChange = new EventEmitter<string>();

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(this.storageKey);
      if (stored !== null) {
        this.value = stored;
        // Emit the saved value so parent gets it
        this.valueChange.emit(this.value);
      }
    }
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.storageKey, this.value);
    }
    this.valueChange.emit(this.value);
  }
}
