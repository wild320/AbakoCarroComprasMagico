import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ShopService } from '../../../../shared/api/shop.service';
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
    layout: 'standard' | 'columnar' | 'sidebar' = 'standard';
    sidebarPosition: 'start' | 'end' = 'start'; // For LTR scripts "start" is "left" and "end" is "right"
    private cadenaString: string = "";    
    private valorProductoUnit: string = "";
    constructor(
        private shop: ShopService,
        private route: ActivatedRoute,
        public articulossvc: ArticulosService,
    ) {}

    ngOnInit(): void {

        this.route.paramMap.subscribe(data => {

            // tomar el articulos seleccionado
            // tslint:disable-next-line: deprecation
            this.ArticulosSuscribe$ = this.articulossvc.getArticuloDetalle$().subscribe(Data => {
                this.product = this.articulossvc.getArticuloDetalle().item;
                if (this.product) {
                    //this.setMetaTags();
                    this.cadenaString = this.product.name;
                    this.valorProductoUnit = this.product.price.toString();

                    // Define una expresión regular para encontrar el contenido entre paréntesis
                    const regExp = /\(([^)]+)\)/;

                    // Ejecuta la expresión regular en cadenaString y guarda el resultado en matches
                    const matches = regExp.exec(this.cadenaString);

                    // Verifica si hay coincidencias encontradas por la expresión regular
                    if (matches) {
                        // Desestructura el contenido encontrado para obtener valorUnitario y nombreUnidadV
                        const [valorUnitario, nombreUnidadV] = matches[1].split(' ');

                        // Calcular el valor por unidad dividiendo valorProductoUnit entre valorUnitario
                        const valor = parseInt(this.valorProductoUnit, 10) / parseInt(valorUnitario, 10);

                        // Asigna el valor calculado y el nombre de la unidad al objeto product
                        this.product["ValorUnidadV"] = `${valor}`;
                        this.product["NombreUnidadV"] = nombreUnidadV;
                    }

                } else {
                    this.articulossvc.SetSeleccionarArticuloDetalle(Number(this.getProductoSlug()), true);
                }

                        if (this.product === undefined) {
                            this.articulossvc.SetSeleccionarArticuloDetalle(Number(this.getProductoSlug()), true);
                        }

            this.SetBreadcrumbs(JSON.parse(JSON.stringify(this.articulossvc.getArticuloDetalle().breadcrumbs)));
        });
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
        if(this.ArticulosSuscribe$) this.ArticulosSuscribe$.unsubscribe();
    }

    getProductoSlug(): string|null {
        return this.route.snapshot.params.productSlug || this.route.snapshot.data.productSlug || null;

    }
}
