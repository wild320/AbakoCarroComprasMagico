import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ShopService } from '../../../../shared/api/shop.service';
import { Link } from '../../../../shared/interfaces/link';

// servicios
import { ArticulosService } from '../../../../shared/services/articulos.service';

// modelos
import { DOCUMENT } from '@angular/common';
import { NegocioService } from 'src/app/shared/services/negocio.service';
import { StoreService } from 'src/app/shared/services/store.service';
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
    private valorProductoUnit: any;
    private productSlug: string | null;
    negocioConfig: any;

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        @Inject(DOCUMENT) private document: Document,
        private shop: ShopService,
        private route: ActivatedRoute,
        public articulossvc: ArticulosService,
        private negocio: NegocioService,
        public StoreSvc: StoreService,

    ) {
        this.productSlug = this.route.snapshot.params['productSlug'] || null;
        this.route.data.subscribe(data => {

            const resolvedProduct = data['product'];

            this.layout = data['layout'] || this.layout;

            this.sidebarPosition = data['sidebarPosition'] || this.sidebarPosition;

            this.negocioConfig = this.negocio.configuracion;

            if (resolvedProduct) {
                this.product = resolvedProduct;
                this.setupProductDetails();
            }

            this.articulossvc.RecuperarArticulosRelacionados(Number(this.productSlug));
            this.articulossvc.getArticulosRelacionados$().subscribe(relatedProducts => {
                this.relatedProducts = relatedProducts;
            });
        });
    }

    ngOnInit(): void {
    }

    private setupProductDetails(): void {
        this.cadenaString = this.product.name;
        this.valorProductoUnit = this.product.price;

        const regExp = /\(([^)]+)\)/;
        const matches = regExp.exec(this.cadenaString);

        if (matches) {
            const [valorUnitario, nombreUnidadV] = matches[1].split(' ');

            const valor = parseInt(this.valorProductoUnit, 10) / parseInt(valorUnitario, 10);
            this.product["ValorUnidadV"] = `${valor}`;
            this.product["NombreUnidadV"] = nombreUnidadV;
        }

        this.SetBreadcrumbs(this.articulossvc.getArticuloDetalle().breadcrumbs);

    }

    SetBreadcrumbs(breadcrumbs: any[]) {

        this.shop.SetBreadcrumbs(breadcrumbs);
        this.shop.SetBreadcrumb(this.product?.name, '');
        this.breadcrumbs = this.shop.breadcrumbs;
    }

    ngOnDestroy(): void {
        if (this.ArticulosSuscribe$) this.ArticulosSuscribe$.unsubscribe();
    }

    getProductoSlug(): string | null {
        return this.route.snapshot.params['productSlug'] || this.route.snapshot.data['productSlug'] || null;

    }
}
