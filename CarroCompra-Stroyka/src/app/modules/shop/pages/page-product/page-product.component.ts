import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ShopService } from '../../../../shared/api/shop.service';
import { Link } from '../../../../shared/interfaces/link';

// servicios
import { ArticulosService } from '../../../../shared/services/articulos.service';

// modelos
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { Item } from '../../../../../data/modelos/articulos/Items';
import { NegocioService } from 'src/app/shared/services/negocio.service';
import { StoreService } from 'src/app/shared/services/store.service';

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
        private titleService: Title,
        public StoreSvc: StoreService,
        private metaTagService: Meta,
    ) { 
        this.productSlug = this.route.snapshot.params['productSlug'] || null;
        this.route.data.subscribe(data => {

            const resolvedProduct = data['product'];

            this.layout = data['layout'] || this.layout;

            this.sidebarPosition = data['sidebarPosition'] || this.sidebarPosition;

            this.negocioConfig = this.negocio.configuracion;

            if (resolvedProduct) {
                this.product = resolvedProduct;
                console.log(this.product);
                this.setupProductDetails();
               // this.setMetaTags();
            }

            this.articulossvc.RecuperarArticulosRelacionados(Number(this.productSlug));
            this.articulossvc.getArticulosRelacionados$().subscribe(relatedProducts => {
                this.relatedProducts = relatedProducts;
            });
        });
    }

    ngOnInit(): void {
        // if (isPlatformBrowser(this.platformId)) {



        //     this.route.paramMap.subscribe(data => {

        //         this.ArticulosSuscribe$ = this.articulossvc.getArticuloDetalle$().subscribe(Data => {
        //             this.product = this.articulossvc.getArticuloDetalle().item;
        //             if (this.product) {
        //                 this.setMetaTags();
        //                 this.cadenaString = this.product.name;
        //                 this.valorProductoUnit = this.product.price;

        //                 const regExp = /\(([^)]+)\)/;
        //                 const matches = regExp.exec(this.cadenaString);

        //                 if (matches) {
        //                     const [valorUnitario, nombreUnidadV] = matches[1].split(' ');

        //                     // Calcular valor por unidad
        //                     const valor = parseInt(this.valorProductoUnit, 10) / parseInt(valorUnitario, 10);
        //                     this.product["ValorUnidadV"] = `${valor}`;
        //                     this.product["NombreUnidadV"] = nombreUnidadV;
        //                 }
        //             } else {
        //                 this.articulossvc.SetSeleccionarArticuloDetalle(Number(this.getProductoSlug()), true);
        //             }

        //             this.SetBreadcrumbs(this.articulossvc.getArticuloDetalle().breadcrumbs);
        //         });

        //         this.articulossvc.SetSeleccionarArticuloDetalle(Number(this.getProductoSlug()), false);
        //         this.articulossvc.RecuperarArticulosRelacionados(Number(this.getProductoSlug()));

        //         // tslint:disable-next-line: deprecation

        //         this.articulossvc.getArticulosRelacionados$().subscribe(data => {
        //             this.relatedProducts = this.articulossvc.getArticulosRelacionados();
        //         });

        //     });

        //     // tslint:disable-next-line: deprecation
        //     this.route.data.subscribe(data => {

        //         this.layout = data['layout'] || this.layout;
        //         this.sidebarPosition = data['sidebarPosition'] || this.sidebarPosition;

        //     });
        // }
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

    setMetaTags(): void {

        const negocio = this.negocioConfig;

        const { name, caracteristicas, brand, images, price, rating, inventario, urlAmigable, id } = this.product;

        this.titleService.setTitle(`${negocio.NombreCliente} | ${name}`);

        const baseHref = this.negocio.configuracion.baseUrl;
        const description = caracteristicas || 'Compra este producto de alta calidad al mejor precio.';
        const title = `${name} - ${brand?.['name'] || 'Marca Desconocida'} - Disponible en nuestra tienda`;
        const keywords = `${name}, ${brand?.['name']}, precio, comprar, ${rating} estrellas, ${inventario} en stock, ${price}`;
        const imageUrl = images?.length ? images[0] : `${baseHref}assets/configuracion/LOGO2.png`;

        this.metaTagService.addTags([
            { name: 'description', content: description },
            { name: 'title', content: title },
            { name: 'keywords', content: keywords },
            { property: 'og:title', content: title },
            { property: 'og:description', content: description },
            { property: 'og:image', content: imageUrl },
            { property: 'og:url', content: `${baseHref}/shop/products/${id}/${urlAmigable}` },
            { name: 'twitter:title', content: title },
            { name: 'twitter:description', content: description },
            { name: 'twitter:image', content: imageUrl }
        ]);
    }
    
}
