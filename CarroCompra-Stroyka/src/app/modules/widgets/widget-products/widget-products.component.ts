import { Component, Inject, Input, PLATFORM_ID } from '@angular/core';
import { Product } from '../../../shared/interfaces/product';
import { RootService } from '../../../shared/services/root.service';

// servicios
import { ArticulosService } from '../../../shared/services/articulos.service';

// modelos
import { Item } from '../../../../data/modelos/articulos/Items';
import { StoreService } from 'src/app/shared/services/store.service';
import { isPlatformBrowser } from '@angular/common';


@Component({
    selector: 'app-widget-products',
    templateUrl: './widget-products.component.html',
    styleUrls: ['./widget-products.component.scss']
})
export class WidgetProductsComponent {

    @Input() header = '';
    public islogged: string = '';
    public products: Item[] = [];

    constructor(
        @Inject(PLATFORM_ID)
        private platformId: Object,
        public root: RootService,
        public articulossvc: ArticulosService,
        public storeSvc: StoreService
    ) {
        if (isPlatformBrowser(this.platformId)) {

            // Recuperar los artoculos mas vendidos
            if (this.articulossvc.RecuperoMasVendidos) {
                this.products = this.articulossvc.getArticulosMasVendidos().slice(0, 6);
            } else {

                // tslint:disable-next-line: deprecation
                this.articulossvc.getArticulosMasVendidos$().subscribe(data => {
                    this.products = this.articulossvc.getArticulosMasVendidos().slice(0, 6);
                });
            }

            this.islogged = localStorage.getItem("isLogue");

        }

    }
}
