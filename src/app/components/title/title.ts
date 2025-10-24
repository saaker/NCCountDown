import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
  HostListener,
} from '@angular/core';

@Component({
  selector: 'app-title',
  styleUrl: './title.scss',
  template: `
    <div class="container" #container>
      <div class="title" #textElement>Time to {{ textValue }}</div>
    </div>
  `,
})
export class Title implements AfterViewInit, OnChanges, OnDestroy {
  private measurer!: HTMLElement;
  private mutationObserver?: MutationObserver;
  private resizeObserver?: ResizeObserver;
  @Input() textValue = '';
  @ViewChild('textElement', { static: true }) textElement!: ElementRef<HTMLElement>;
  @ViewChild('container', { static: true }) container!: ElementRef<HTMLElement>;

  ngAfterViewInit(): void {
    this.createMeasurer();

    // Only use observers in browser environment
    if (typeof window !== 'undefined') {
      // Observe DOM/text changes inside the visible text node
      if ('MutationObserver' in window) {
        this.mutationObserver = new MutationObserver(() => this.scheduleFit());
        this.mutationObserver.observe(this.textElement.nativeElement, {
          characterData: true,
          childList: true,
          subtree: true,
        });
      }

      // Observe container resize
      if ('ResizeObserver' in window) {
        this.resizeObserver = new ResizeObserver(() => this.scheduleFit());
        this.resizeObserver.observe(this.container.nativeElement);
      }
    }

    // initial fit
    this.scheduleFit();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['textValue']) {
      // schedule to run after change detection
      this.scheduleFit();
    }
  }

  ngOnDestroy(): void {
    if (typeof window !== 'undefined') {
      this.mutationObserver?.disconnect();
      this.resizeObserver?.disconnect();
      this.measurer?.remove();
    }
  }

  @HostListener('window:resize')
  onWindowResize() {
    if (typeof window !== 'undefined') {
      this.scheduleFit();
    }
  }

  // --- Helpers ----------------------------------------------------------

  private createMeasurer() {
    if (typeof document === 'undefined') {
      return;
    }
    // create an off-screen element that mirrors text styles but is not visible
    this.measurer = document.createElement('span');
    document.body.appendChild(this.measurer);

    Object.assign(this.measurer.style, {
      position: 'absolute',
      left: '-9999px',
      top: '0px',
      visibility: 'hidden',
      whiteSpace: 'nowrap',
      display: 'inline-block',
      lineHeight: '1',
    });

    // Persist title text across rerenders (load stored value if present)
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('app.titleText');
        if (stored && stored.trim().length) {
          this.textValue = stored;
          // reflect immediately in DOM
          this.textElement.nativeElement.textContent = `Time to ${this.textValue}`;
        }

        // Observe changes just for persistence
        if ('MutationObserver' in window) {
          const persistObserver = new MutationObserver(() => {
            const current = this.textElement.nativeElement.textContent || '';
            localStorage.setItem('app.titleText', current.replace(/^Time to\s*/, ''));
          });
          persistObserver.observe(this.textElement.nativeElement, {
            characterData: true,
            childList: true,
            subtree: true,
          });
        }
      } catch {
        // ignore storage errors (private mode / quotas)
      }
    }

    // copy font-affecting styles from the visible element
    const computed = getComputedStyle(this.textElement.nativeElement);
    this.measurer.style.fontFamily = computed.fontFamily;
    this.measurer.style.fontWeight = computed.fontWeight;
    this.measurer.style.letterSpacing = computed.letterSpacing;
    this.measurer.style.fontStyle = computed.fontStyle;
    this.measurer.style.textTransform = computed.textTransform;
  }

  private scheduleFit() {
    // use RAF to group multiple triggers and ensure DOM updated
    if (typeof window !== 'undefined' && 'requestAnimationFrame' in window) {
      window.requestAnimationFrame(() => this.fitTextToWidth());
    } else {
      // fallback for SSR or tests
      setTimeout(() => this.fitTextToWidth());
    }
  }

  private fitTextToWidth() {
    const container = this.container?.nativeElement;
    const textEl = this.textElement?.nativeElement;
    if (!container || !textEl || !this.measurer) return;

    const maxWidth = container.clientWidth;
    if (maxWidth <= 0) return;

    // text to measure — use the same text node as the visible element
    const content = textEl.textContent ?? '';

    // binary search bounds
    let lo = 5;
    let hi = 300;
    let best = lo;

    // Helper that measures width for a given font size using the measurer
    const measure = (fontSizePx: number) => {
      this.measurer.style.fontSize = `${fontSizePx}px`;
      // ensure text-transform / trimming matches
      this.measurer.textContent = content;
      // synchronous measurement
      return this.measurer.getBoundingClientRect().width;
    };

    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      const w = measure(mid);

      if (w <= maxWidth) {
        best = mid;
        lo = mid + 1; // try larger
      } else {
        hi = mid - 1; // too large
      }
    }

    // apply final font-size to visible element
    textEl.style.fontSize = `${best}px`;
  }
}
