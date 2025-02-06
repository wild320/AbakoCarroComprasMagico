import { Component, EventEmitter, Inject, Input, OnChanges, OnDestroy, Output, PLATFORM_ID, SimpleChanges } from '@angular/core';
import { Item } from '../../../../data/modelos/articulos/Items';
import { BlockHeaderGroup } from '../../../shared/interfaces/block-header-group';
import { isPlatformBrowser } from '@angular/common';
import { WINDOW } from 'src/app/providers/window';

@Component({
    selector: 'app-block-products-carousel',
    templateUrl: './block-products-carousel.component.html',
    styleUrls: ['./block-products-carousel.component.scss']
})
export class BlockProductsCarouselComponent implements OnChanges, OnDestroy {
    @Input() header: string;
    @Input() layout: 'grid-4' | 'grid-4-sm' | 'grid-5' | 'horizontal' = 'grid-4';
    @Input() rows = 1;
    @Input() products: Item[] = [];
    @Input() groups: BlockHeaderGroup[] = [];
    @Input() withSidebar = false;
    @Input() loading = false;

    @Output() groupChange: EventEmitter<BlockHeaderGroup> = new EventEmitter();

    columns: Item[][] = [];

    carouselOptionsByLayout: any = {
        'grid-4': {
            responsive: {
                1110: { items: 4, margin: 14 },
                930: { items: 4, margin: 10 },
                690: { items: 3, margin: 10 },
                400: { items: 2, margin: 10 },
                0: { items: 1 }
            }
        },
        'grid-4-sm': {
            responsive: {
                820: { items: 4, margin: 14 },
                640: { items: 3, margin: 10 },
                400: { items: 2, margin: 10 },
                0: { items: 1 }
            }
        },
        'grid-5': {
            responsive: {
                1110: { items: 5, margin: 12 },
                930: { items: 4, margin: 10 },
                690: { items: 3, margin: 10 },
                400: { items: 2, margin: 10 },
                0: { items: 1 }
            }
        },
        horizontal: {
            items: 3,
            responsive: {
                1110: { items: 3, margin: 14 },
                930: { items: 3, margin: 10 },
                690: { items: 2, margin: 10 },
                0: { items: 1 }
            }
        }
    };

    constructor(
        @Inject(PLATFORM_ID) private platformId: object,    
            @Inject(WINDOW) private window: Window | null,) {
            if(isPlatformBrowser(this.platformId)){
                this.window.addEventListener('resize', this.updateColumns.bind(this));
            }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if(isPlatformBrowser(this.platformId)){
            if (changes['products'] || changes['rows']) {
                this.updateColumns();
            }
        }
 
    }

    ngOnDestroy(): void {
        if(isPlatformBrowser(this.platformId)){
            this.window.removeEventListener('resize', this.updateColumns.bind(this));
        }
    }

    updateColumns(): void {
        this.columns = [];
        if (this.products && this.rows > 0) {
            const products = this.products.slice();
            const itemsPerColumn = this.getItemsPerColumn();

            while (products.length > 0) {
                this.columns.push(products.splice(0, itemsPerColumn));
            }
        }
    }

    getItemsPerColumn(): number {
        if(isPlatformBrowser(this.platformId)){
        // Obtener la configuración responsive para el layout actual
        const responsiveConfig = this.carouselOptionsByLayout[this.layout]?.responsive;
        if (!responsiveConfig) return 1;

        // Obtener el ancho actual de la ventana
        const screenWidth = this.window.innerWidth;

        // Buscar la configuración adecuada para el tamaño de pantalla actual
        const breakpoints = Object.keys(responsiveConfig).map(Number).sort((a, b) => b - a);
        for (const breakpoint of breakpoints) {
            if (screenWidth >= breakpoint) {
                // Calcula el número de items y asegura que no exceda el límite de 6
                return Math.min(responsiveConfig[breakpoint].items * this.rows, 6);
            }
        }

        // Valor por defecto en caso de no cumplirse ninguna condición
        return Math.min(1 * this.rows, 6);
    }
    }
}
