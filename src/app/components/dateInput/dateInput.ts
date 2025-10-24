import {
  Component,
  Output,
  EventEmitter,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';

@Component({
  selector: 'app-date-input',
  styleUrl: './dateInput.scss',
  template: `<input
    #dateInputRef
    name="countdownDateInput"
    type="date"
    [min]="minDate"
    [value]="dateValue"
    (input)="onInput($event)"
  />`,
})
export class DateInput implements OnInit, AfterViewInit {
  placeHolder = new Date();
  dateValue = '';
  minDate = new Date().toISOString().split('T')[0];
  @Output() valueChange = new EventEmitter<Date>();
  @ViewChild('dateInputRef') dateInputRef!: ElementRef<HTMLInputElement>;

  ngOnInit(): void {
    // Load saved date from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('countdownDate');
      if (saved) {
        this.dateValue = saved;
        // Emit the saved date immediately so parent components get it
        this.valueChange.emit(new Date(saved));
      }
    }
  }

  ngAfterViewInit(): void {
    // Ensure the input reflects the saved value
    if (this.dateValue && this.dateInputRef) {
      this.dateInputRef.nativeElement.value = this.dateValue;
    }
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.dateValue = target.value;
    localStorage.setItem('countdownDate', this.dateValue);
    this.valueChange.emit(new Date(this.dateValue));
  }
}
