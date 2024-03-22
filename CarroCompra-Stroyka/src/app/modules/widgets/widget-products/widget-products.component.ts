import { Component, Input } from '@angular/core';
import { Product } from '../../../shared/interfaces/product';
import { RootService } from '../../../shared/services/root.service';

// servicios
import { ArticulosService } from '../../../shared/services/articulos.service';

// modelos
import { Item } from '../../../../data/modelos/articulos/Items';
import { StoreService } from 'src/app/shared/services/store.service';


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
        public root: RootService,
        public articulossvc: ArticulosService,
        public storeSvc: StoreService
        ) {

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
