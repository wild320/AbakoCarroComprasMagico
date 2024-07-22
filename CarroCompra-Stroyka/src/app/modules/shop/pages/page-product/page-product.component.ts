import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ShopService } from '../../../../shared/api/shop.service';
import { Link } from '../../../../shared/interfaces/link';

// servicios
import { ArticulosService } from '../../../../shared/services/articulos.service';

// modelos
import { Item } from '../../../../../data/modelos/articulos/Items';
import { Meta } from '@angular/platform-browser';

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
    private valorProductoUnit: any;
    constructor(
        private shop: ShopService,
        private route: ActivatedRoute,
        public articulossvc: ArticulosService,
        private meta: Meta
    ) { }

    ngOnInit(): void {

        this.route.paramMap.subscribe(data => {

            // tomar el articulos seleccionado
            // tslint:disable-next-line: deprecation
            this.ArticulosSuscribe$ = this.articulossvc.getArticuloDetalle$().subscribe(Data => {
                this.product = this.articulossvc.getArticuloDetalle().item;
                if (this.product) {
                    this.setMetaTags();
                    this.cadenaString = this.product.name;
                    this.valorProductoUnit = this.product.price;

                    const regExp = /\(([^)]+)\)/;
                    const matches = regExp.exec(this.cadenaString);

                    if (matches) {
                        const [valorUnitario, nombreUnidadV] = matches[1].split(' ');
    
                        // Calcular valor por unidad
                        const valor = parseInt(this.valorProductoUnit, 10) / parseInt(valorUnitario, 10);
                        this.product["ValorUnidadV"] = `${valor}`;
                        this.product["NombreUnidadV"] = nombreUnidadV;
                    }
                } else {
                    this.articulossvc.SetSeleccionarArticuloDetalle(Number(this.getProductoSlug()), true);
                }

                    // Define una expresión regular para encontrar el contenido entre paréntesis
                    const regExp = /\(([^)]+)\)/;

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

    SetBreadcrumbs(breadcrumbs: any[]) {

        this.shop.SetBreadcrumbs(breadcrumbs);
        this.shop.SetBreadcrumb(this.product?.name, '');

        this.breadcrumbs = this.shop.breadcrumbs;

    }

    ngOnDestroy(): void {
        if(this.ArticulosSuscribe$) this.ArticulosSuscribe$.unsubscribe();
    }

    getProductoSlug(): string | null {
        return this.route.snapshot.params.productSlug || this.route.snapshot.data.productSlug || null;

    }

    setMetaTags(): void {
        this.meta.updateTag({ name: 'description', content: this.product.caracteristicas });
        this.meta.updateTag({ property: 'og:title', content: this.product.name });
        this.meta.updateTag({ property: 'og:description', content: this.product.caracteristicas });
        this.meta.updateTag({ property: 'og:image', content: this.product.images[0] });
        this.meta.updateTag({ property: 'og:url', content: window.location.href });
        this.meta.updateTag({ name: 'twitter:title', content: this.product.name });
        this.meta.updateTag({ name: 'twitter:description', content: this.product.caracteristicas });
        this.meta.updateTag({ name: 'twitter:image', content: this.product.images[0] });
    }
}
