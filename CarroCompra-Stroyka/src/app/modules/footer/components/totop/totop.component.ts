import { Component, HostBinding, Inject, NgZone, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { WINDOW } from 'src/app/providers/window';

@Component({
    selector: 'app-totop',
    templateUrl: './totop.component.html',
    styleUrls: ['./totop.component.scss']
})
export class TotopComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    show = false;

    @HostBinding('class.totop') classTotop = true;

    @HostBinding('class.totop--show') get classTotopShow(): boolean {
        return this.show;
    }

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        @Inject(WINDOW) private window: Window | null,
        @Inject(DOCUMENT) private document: Document,
        private zone: NgZone
    ) { }

    ngOnInit(): void {
        if (isPlatformBrowser(this.platformId) && this.window) {
            const showFrom = 300;

            this.zone.runOutsideAngular(() => {
                fromEvent(this.window, 'scroll', { passive: true })
                    .pipe(takeUntil(this.destroy$))
                    .subscribe(() => {
                        const scrollPosition = this.window!.pageYOffset || this.document.documentElement.scrollTop;

                        if (scrollPosition >= showFrom) {
                            if (!this.show) {
                                this.zone.run(() => this.show = true);
                            }
                        } else {
                            if (this.show) {
                                this.zone.run(() => this.show = false);
                            }
                        }
                    });
            });
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    onClick(): void {
        if (isPlatformBrowser(this.platformId) && this.window) {
            try {
                this.window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
            } catch {
                this.window.scrollTo(0, 0);
            }
        }
    }
}
