import { Component } from '@angular/core';

@Component({
  selector: 'app-logo',
  styleUrl: './logo.scss',
  template: `<img [src]="logoPath" alt="Logo" />`,
})
export class Logo {
  logoPath = 'assets/logo_nc1.png';
}
