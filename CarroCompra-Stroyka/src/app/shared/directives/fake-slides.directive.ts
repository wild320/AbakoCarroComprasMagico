import { Directive, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, HostListener } from '@angular/core';

@Directive({
    selector: '[appFakeSlides]',
    exportAs: 'appFakeSlides'
})
export class FakeSlidesDirective implements OnInit, OnChanges, OnDestroy {
    @Input() options: any; // Especifica el tipo según tu configuración
    @Input() appFakeSlides = 0;

    slides: number[] = [];
    slidesCount = 0;

    private resizeHandler: () => void;

    constructor(private el: ElementRef) { }

    ngOnInit(): void {
        this.calc();
        // Usamos el evento de resize directamente en el objeto window
        this.resizeHandler = this.onResize.bind(this);
        window.addEventListener('resize', this.resizeHandler);
    }

    private onResize(): void {
        this.calc();
    }

    calc(): void {
        let newFakeSlidesCount = 0;

        if (this.options) {
            let match = -1;
            const viewport = this.el.nativeElement.querySelector('.owl-carousel').clientWidth;
            const overwrites = this.options.responsive;

            if (overwrites) {
                for (const key in overwrites) {
                    if (overwrites.hasOwnProperty(key)) {
                        if (+key <= viewport && +key > match) {
                            match = Number(key);
                        }
                    }
                }
            }

            if (match >= 0) {
                const items = overwrites[match].items;
                newFakeSlidesCount = Math.max(0, items - this.appFakeSlides);
            } else if (this.options.items) {
                newFakeSlidesCount = Math.max(0, this.options.items - this.appFakeSlides);
            }
        }

        if (this.slidesCount !== newFakeSlidesCount) {
            this.slides = [];
            this.slidesCount = newFakeSlidesCount;

            for (let i = 0; i < newFakeSlidesCount; i++) {
                this.slides.push(i);
            }
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['options'] || changes['appFakeSlides']) {
            this.calc();
        }
    }

    ngOnDestroy(): void {
        // Eliminar el listener al destruir el componente
        window.removeEventListener('resize', this.resizeHandler);
    }
}
