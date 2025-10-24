import { Component, signal } from '@angular/core';
import { Logo } from './layout/header/logo/logo';
import { Title } from './components/title/title';
import { Countdown } from './components/countdown/countdown';
import { Quote } from './components/quote/quote';
import { RowWrapper } from './components/rowWrapper/rowWrapper';
import { InputWrapper } from './components/inputWrapper/inputWrapper';
import { TextInput } from './components/textInput/textInput';
import { DateInput } from './components/dateInput/dateInput';

@Component({
  selector: 'app-root',
  imports: [Logo, Title, Countdown, Quote, TextInput, DateInput, RowWrapper, InputWrapper],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('NC-count-down');
  protected readonly textValue = signal('');
  protected readonly dateValue = signal(new Date());
  protected readonly isLandscape = signal<boolean>(false);
  protected readonly label = '';

  constructor() {
    // Load saved values from localStorage on app initialization
    if (typeof window !== 'undefined') {
      const savedDate = localStorage.getItem('countdownDate');
      if (savedDate) {
        this.dateValue.set(new Date(savedDate));
      }

      const savedText = localStorage.getItem('countdownText');
      if (savedText) {
        this.textValue.set(savedText);
      }

      if ('screen' in window && window.screen.orientation) {
        screen.orientation.addEventListener('change', () => {
          this.setOrientation(window.screen.orientation.type);
        });

        window.addEventListener('load', () => {
          this.setOrientation(window.screen.orientation.type);
        });
      }
    }
  }

  onTextChange(value: string) {
    this.textValue.set(value);
    // Save to localStorage whenever text changes
    if (typeof window !== 'undefined') {
      localStorage.setItem('countdownText', value);
    }
  }

  onDateChange(value: Date) {
    this.dateValue.set(value);
    // Save to localStorage whenever date changes
    if (typeof window !== 'undefined') {
      localStorage.setItem('countdownDate', value.toISOString().split('T')[0]);
    }
  }

  setOrientation(orientation: OrientationType) {
    const newIsLandscape = orientation === 'landscape-primary' ? true : false;
    this.isLandscape.set(newIsLandscape);
  }
}
