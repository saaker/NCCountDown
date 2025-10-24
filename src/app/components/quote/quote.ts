import {
  Component,
  OnInit,
  OnDestroy,
  Inject,
  PLATFORM_ID,
  ChangeDetectorRef,
} from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Subscription, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

interface QuoteResponse {
  id: number;
  quote: string;
  author: string;
}

@Component({
  selector: 'app-quote',
  styleUrl: './quote.scss',
  template: `
    @if (loading) {
    <div class="lds-dual-ring"></div>
    } @else if (error) {
    <div class="error">{{ error }}</div>
    } @else {
    {{ quote }}
    }
  `,
})
export class Quote implements OnInit, OnDestroy {
  private subscription?: Subscription;
  quote = '';
  loading = false;
  error = '';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    // Only fetch quote in browser environment
    if (isPlatformBrowser(this.platformId)) {
      this.fetchQuote();
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  fetchQuote() {
    this.loading = true;
    this.error = '';
    this.cdr.detectChanges(); // Trigger change detection for loading state

    this.subscription = this.http
      .get<QuoteResponse>('https://dummyjson.com/quotes/random', { cache: 'no-cache' })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error fetching quote:', error);
          this.error = 'Failed to load quote. Please try again.';
          this.loading = false;
          this.cdr.detectChanges(); // Trigger change detection for error state
          return this.error; // Return null on error
        })
      )
      .subscribe((data: QuoteResponse | string) => {
        this.loading = false;
        if (data && typeof data !== 'string') {
          this.quote = data.quote;
        }
        this.cdr.detectChanges(); // Trigger change detection for success state
      });
  }
}
