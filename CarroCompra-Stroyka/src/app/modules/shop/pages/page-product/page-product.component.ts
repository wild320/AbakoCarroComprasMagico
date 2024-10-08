import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ShopService } from '../../../../shared/api/shop.service';
import { Link } from '../../../../shared/interfaces/link';

// servicios
import { ArticulosService } from '../../../../shared/services/articulos.service';

// modelos
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Meta } from '@angular/platform-browser';
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
    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        @Inject(DOCUMENT) private document: Document,
        private shop: ShopService,
        private route: ActivatedRoute,
        public articulossvc: ArticulosService,
        private meta: Meta
    ) { }

    ngOnInit(): void {
        if (isPlatformBrowser(this.platformId)) {



            this.route.paramMap.subscribe(data => {

                this.ArticulosSuscribe$ = this.articulossvc.getArticuloDetalle$().subscribe(Data => {
                    this.product = this.articulossvc.getArticuloDetalle().item;
                    console.log("detll", this.product);
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

                    this.SetBreadcrumbs(this.articulossvc.getArticuloDetalle().breadcrumbs);
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

                this.layout = data['layout'] || this.layout;
                this.sidebarPosition = data['sidebarPosition'] || this.sidebarPosition;

            });
        }
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
        const { name, caracteristicas, brand, images, price, rating, inventario, urlAmigable, id } = this.product;

        const baseHref = this.document.querySelector('base')?.getAttribute('href') || '';
    
        // Set meta description (use 'caracteristicas' or a default value)
        const description = caracteristicas || 'Compra este producto de alta calidad al mejor precio.';
    
        // Set meta title
        const title = `${name} - ${brand?.['name'] || 'Marca Desconocida'} - Disponible en nuestra tienda`;
    
        // Set meta keywords (e.g., name, brand, product details)
        const keywords = `${name}, ${brand?.['name'] }, precio, comprar, ${rating} estrellas, ${inventario} en stock, ${price}`;
    
        // Set product image for Open Graph and Twitter Cards
        const imageUrl = images?.length ? images[0] : `${baseHref}/assets/configuracion/LOGO2.png`;
    
        // Update the meta tags
        this.meta.updateTag({ name: 'description', content: description });
        this.meta.updateTag({ name: 'title', content: title });
        this.meta.updateTag({ name: 'keywords', content: keywords });
    
        // Open Graph meta tags for social sharing
        this.meta.updateTag({ property: 'og:title', content: title });
        this.meta.updateTag({ property: 'og:description', content: description });
        this.meta.updateTag({ property: 'og:image', content: imageUrl });
        this.meta.updateTag({ property: 'og:url', content: `${baseHref}/shop/products/${id}/${urlAmigable}` });
    
        // Twitter Card meta tags
        this.meta.updateTag({ name: 'twitter:title', content: title });
        this.meta.updateTag({ name: 'twitter:description', content: description });
        this.meta.updateTag({ name: 'twitter:image', content: imageUrl });
    }
    
}
