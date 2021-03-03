import { Component, Input } from '@angular/core';
import { Product } from '../../../shared/interfaces/product';
import { RootService } from '../../../shared/services/root.service';

// servicios
import { ArticulosService } from '../../../shared/services/articulos.service';

// modelos
import { Item } from 'src/data/modelos/articulos/Items';

@Component({
    selector: 'app-widget-products',
    templateUrl: './widget-products.component.html',
    styleUrls: ['./widget-products.component.scss']
})
export class WidgetProductsComponent {
    @Input() header = '';

    public products: Item[] = [];

    constructor(public root: RootService,
                public articulossvc: ArticulosService) {

        this.articulossvc.getArticulosMasVendidos$().subscribe(data => {

            this.products = this.articulossvc.getArticulosMasVendidos().slice(0 , 6);

        });

     }
}
