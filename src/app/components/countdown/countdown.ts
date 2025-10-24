import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-countdown',
  styleUrl: './countdown.scss',
  template: `<div [style.font-size]="isLandscape ? '74px' : '32px'">
    {{ daysRemaining }} days, {{ hoursRemaining }} h, {{ minutesRemaining }}m,
    {{ secondsRemaining }}s
  </div>`,
})
export class Countdown implements OnInit, OnChanges {
  @Input() dateValue: Date = new Date();
  @Input() isLandscape?: boolean = true;

  daysRemaining: number = 0;
  hoursRemaining: number = 0;
  minutesRemaining: number = 0;
  secondsRemaining: number = 0;

  ngOnInit(): void {
    this.calculateAllValues();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dateValue']) {
      this.calculateAllValues();
    }
  }

  private calculateAllValues(): void {
    const now = new Date();
    const target = new Date(this.dateValue);
    const timeDiff = target.getTime() - now.getTime();

    if (timeDiff > 0) {
      this.daysRemaining = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      this.hoursRemaining = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      this.minutesRemaining = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      this.secondsRemaining = Math.floor((timeDiff % (1000 * 60)) / 1000);
    }
  }
}
