import { Component, Inject, Input, PLATFORM_ID } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { StoreService } from 'src/app/shared/services/store.service';
import { DirectionService } from '../../../shared/services/direction.service';

// Servicio
import { PaginasService } from '../../../shared/services/paginas.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
    selector: 'app-block-slideshow',
    templateUrl: './block-slideshow.component.html',
    styleUrls: ['./block-slideshow.component.scss']
})
export class BlockSlideshowComponent {
    @Input() withDepartments = false;

    options: any;
    slides: any[] = [];

    constructor(
        @Inject(PLATFORM_ID) private platformId: object,
        public sanitizer: DomSanitizer,
        private directionService: DirectionService,
        public paginasService: PaginasService,
        public StoreSvc: StoreService
    ) {
        this.options = {
            nav: false,
            dots: true,
            loop: true,
            mouseDrag: true,
            touchDrag: true,
            pullDrag: false,
            autoplay: true,
            animateIn: 'fadeIn',
            animateOut: 'fadeOut',
            autoplaySpeed: 800,
            autoplayTimeout: 5000,
            navSpeed: 700,
            responsive: {
                0: { items: 1 }
            },
            rtl: this.directionService.isRTL()
        };

        if(isPlatformBrowser(this.platformId)){
            this.cargarAcordeones();
        }

    }

    private async cargarAcordeones(): Promise<void> {
        // Verificar si ya hay diapositivas cargadas
        if (!this.slides.length) {
            try {
                const response = await this.paginasService.cargarAcordeon();
                this.slides = response || []; // Asignar respuesta o array vacío si no hay datos
            } catch (error) {
                console.error('Error al cargar las diapositivas:', error);
            }
        }
    }
}
