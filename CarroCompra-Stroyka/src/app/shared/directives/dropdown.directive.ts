import { Directive, ElementRef, Inject, Input, OnDestroy, NgZone, PLATFORM_ID } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { takeUntil } from 'rxjs/operators';
import { ClabelRutas } from '../../../data/contantes/cRutas';
import { UsuarioService } from '../services/usuario.service';


@Directive({
    selector: '[appDropdown]',
    exportAs: 'appDropdown'
})
export class DropdownDirective implements OnDestroy {
    private destroy$ = new Subject<void>();

    @Input() appDropdown = '';

    get isOpen(): boolean {
        return this.element.classList.contains(this.appDropdown);
    }

    private get element(): HTMLElement {
        return this.el.nativeElement;
    }

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private el: ElementRef,
        private zone: NgZone,
        public usuariosvc: UsuarioService
    ) {
        if (isPlatformBrowser(this.platformId)) {
            this.zone.runOutsideAngular(() => {
                fromEvent<MouseEvent>(document, 'mousedown').pipe(
                    takeUntil(this.destroy$)
                ).subscribe((event) => {
                    if (!el.nativeElement.contains(event.target)) {
                        this.close(event);
                    }
                });
            });
        }
    }

    toggle(force?: boolean): void {
        this.element.classList.toggle(this.appDropdown, force);
    }

    close(item): void {
        this.toggle(false);

        // cerrar sesión
        if (item.label === ClabelRutas.CerrarSesion){

            this.usuariosvc.loguout();

        }
    }

    open(): void {
        this.toggle(true);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
