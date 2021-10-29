import { Component, OnInit, OnDestroy } from '@angular/core';
import { Product } from '../../../../shared/interfaces/product';
import { ActivatedRoute } from '@angular/router';
import { ShopService } from '../../../../shared/api/shop.service';
import { Observable } from 'rxjs';
import { Link } from '../../../../shared/interfaces/link';

// servicios
import { ArticulosService } from '../../../../shared/services/articulos.service';

// modelos
import { Item } from '../../../../../data/modelos/articulos/Items';

@Component({
    selector: 'app-page-product',
    templateUrl: './page-product.component.html',
    styleUrls: ['./page-product.component.scss']
})
export class PageProductComponent implements OnInit, OnDestroy {
    relatedProducts: Item[];

    product: Item;
    ArticulosSuscribe$: any;
    breadcrumbs: Link[] = [];
    layout: 'standard'|'columnar'|'sidebar' = 'standard';
    sidebarPosition: 'start'|'end' = 'start'; // For LTR scripts "start" is "left" and "end" is "right"
    cadenaString : any;
    valorUnitario: any;
    valorProductoUnit:any;
    constructor(
        private shop: ShopService,
        private route: ActivatedRoute,
        public articulossvc: ArticulosService,
    ) {

        // tomar el articulos seleccionado
        // tslint:disable-next-line: deprecation
        this.ArticulosSuscribe$ = this.articulossvc.getArticuloDetalle$().subscribe ( Data => {

            this.product = this.articulossvc.getArticuloDetalle().item;
            this.cadenaString = this.product.name;
            this.valorProductoUnit = this.product.price;
            var regExp = /\(([^)]+)\)/;
            var matches = regExp.exec(this.cadenaString);
            const valorFinal = matches[1].split(' ');
            this.valorUnitario = valorFinal[0];
            const valor = parseInt(this.valorProductoUnit) / parseInt(this.valorUnitario)
            this.product["ValorUnidadV"] = `${valor}`;
            this.product["NombreUnidadV"] = `${valorFinal[1]}`;
     

            // verificar si el articulo seleccioando existe en articulos
            if (this.product === undefined){
                this.articulossvc.SetSeleccionarArticuloDetalle(Number(this.getProductoSlug()), true);
            }

            this.SetBreadcrumbs(JSON.parse(JSON.stringify(this.articulossvc.getArticuloDetalle().breadcrumbs)));

        });

     }

    ngOnInit(): void {

        this.route.paramMap.subscribe(data => {
            
            this.articulossvc.SetSeleccionarArticuloDetalle(Number(this.getProductoSlug()), false);

            this.articulossvc.RecuperarArticulosRelacionados(Number(this.getProductoSlug()));

            // tslint:disable-next-line: deprecation
            this.articulossvc.getArticulosRelacionados$().subscribe(data => {
                this.relatedProducts = this.articulossvc.getArticulosRelacionados();
            });

        });

        // tslint:disable-next-line: deprecation
        this.route.data.subscribe(data => {

            this.layout = data.layout || this.layout;
            this.sidebarPosition = data.sidebarPosition || this.sidebarPosition;

        });
    }

    SetBreadcrumbs(breadcrumbs: any[]){

        this.shop.SetBreadcrumbs(breadcrumbs);
        this.shop.SetBreadcrumb(this.product?.name, '');

        this.breadcrumbs = this.shop.breadcrumbs;

    }

    ngOnDestroy(): void {
        this.ArticulosSuscribe$.unsubscribe();
    }

    getProductoSlug(): string|null {
        return this.route.snapshot.params.productSlug || this.route.snapshot.data.productSlug || null;

    }
}
